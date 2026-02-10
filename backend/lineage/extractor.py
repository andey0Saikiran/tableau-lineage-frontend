"""
Tableau Workbook Metadata Extractor v3.0
Matching notebook extraction logic 100%
"""
import zipfile
import xml.etree.ElementTree as ET
import re
from typing import List, Dict, Set, Any, Tuple
from pathlib import Path
import asyncio
from concurrent.futures import ThreadPoolExecutor
from defusedxml import ElementTree as DefusedET

from .models import CalculatedField, Parameter


# Table calculation functions
TABLE_CALC_FUNCTIONS = {
    'LOOKUP', 'RUNNING_SUM', 'RUNNING_AVG', 'RUNNING_MIN', 'RUNNING_MAX',
    'RUNNING_COUNT', 'WINDOW_SUM', 'WINDOW_AVG', 'WINDOW_MIN', 'WINDOW_MAX',
    'WINDOW_COUNT', 'WINDOW_MEDIAN', 'WINDOW_PERCENTILE', 'WINDOW_STDEV',
    'WINDOW_VAR', 'FIRST', 'LAST', 'INDEX', 'SIZE', 'RANK', 'RANK_DENSE',
    'RANK_MODIFIED', 'RANK_PERCENTILE', 'RANK_UNIQUE', 'PREVIOUS_VALUE',
    'TOTAL', 'SCRIPT_BOOL', 'SCRIPT_INT', 'SCRIPT_REAL', 'SCRIPT_STR'
}


class TableauExtractionError(Exception):
    """Custom exception for Tableau extraction errors"""
    pass


class TableauExtractor:
    """
    Extracts metadata from Tableau workbooks (.twbx files)
    Matches notebook v3.0 extraction logic exactly
    """

    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        
        # Data structures matching notebook
        self.field_map: Dict[str, str] = {}  # internal_id -> display_name
        self.parameters: List[Dict[str, Any]] = []
        self.parameter_names: Set[str] = set()
        self.parameter_internal_map: Dict[str, str] = {}
        self.raw_fields: Set[str] = set()
        self.calculated_fields: List[CalculatedField] = []

    async def extract_metadata_async(self, twbx_path: str) -> List[CalculatedField]:
        """Asynchronously extract metadata from .twbx file"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._extract_metadata_sync,
            twbx_path
        )

    def _extract_metadata_sync(self, twbx_path: str) -> List[CalculatedField]:
        """Synchronous metadata extraction"""
        try:
            # Reset state
            self.field_map = {}
            self.parameters = []
            self.parameter_names = set()
            self.parameter_internal_map = {}
            self.raw_fields = set()
            self.calculated_fields = []

            # Load workbook
            path = Path(twbx_path)
            if not path.exists():
                raise TableauExtractionError(f"File not found: {twbx_path}")

            if not zipfile.is_zipfile(twbx_path):
                raise TableauExtractionError("File is not a valid .twbx archive")

            with zipfile.ZipFile(twbx_path, "r") as z:
                twb_file = self._find_twb_file(z.namelist())
                if not twb_file:
                    raise TableauExtractionError("No .twb file found inside .twbx archive")

                xml_content = z.read(twb_file)
                root = DefusedET.fromstring(xml_content)

                # Phase 1: Extract parameters FIRST
                self._extract_parameters(root)
                
                # Phase 2: Build field mappings
                self._build_field_mappings(root)
                
                # Phase 3: Extract calculated fields
                self._extract_calculated_fields(root)
                
                # Phase 4: Identify raw fields
                self._identify_raw_fields()

            return self.calculated_fields

        except ET.ParseError as e:
            raise TableauExtractionError(f"XML parsing error: {str(e)}")
        except zipfile.BadZipFile as e:
            raise TableauExtractionError(f"Corrupt zip file: {str(e)}")
        except Exception as e:
            raise TableauExtractionError(f"Unexpected error: {str(e)}")

    def _find_twb_file(self, namelist: List[str]) -> str:
        """Find the .twb file in the archive"""
        twb_files = [f for f in namelist if f.endswith(".twb")]
        return twb_files[0] if twb_files else None

    def _extract_parameters(self, root: ET.Element):
        """Extract parameter definitions - MATCHING NOTEBOOK"""
        for datasource in root.findall('.//datasource'):
            ds_name = datasource.get('name', '')
            
            # Parameters are in a datasource named "Parameters"
            if ds_name.lower() == 'parameters':
                for column in datasource.findall('.//column'):
                    internal_name = column.get('name', '')  # e.g., [Parameter 1]
                    caption = column.get('caption', '')  # e.g., "Select Year Param"
                    value = column.get('value', '')
                    datatype = column.get('datatype', 'string')
                    
                    if not internal_name:
                        continue
                    
                    # Clean internal name
                    clean_internal = internal_name.strip('[]')
                    display_name = caption if caption else clean_internal
                    
                    # Store parameter mapping
                    self.parameter_internal_map[internal_name] = display_name
                    self.parameter_names.add(display_name)
                    
                    # Add to parameters list
                    self.parameters.append({
                        'name': display_name,
                        'internal_name': internal_name,
                        'value': value,
                        'datatype': datatype,
                        'allowed_values': None  # Could extract from members if needed
                    })

    def _build_field_mappings(self, root: ET.Element):
        """Build comprehensive field mappings"""
        for col in root.findall(".//column"):
            name = col.attrib.get("name")
            caption = col.attrib.get("caption")
            if name and caption:
                self.field_map[name] = caption

    def _extract_calculated_fields(self, root: ET.Element):
        """Extract calculated fields from all datasources"""
        for datasource in root.findall(".//datasource"):
            ds_name = datasource.attrib.get("name", "Unknown")
            
            # Skip Parameters datasource
            if ds_name.lower() == 'parameters':
                continue
            
            for col in datasource.findall(".//column"):
                calc = col.find("calculation")
                if calc is None:
                    continue

                raw_name = col.attrib.get("name", "")
                field_name = col.attrib.get("caption", raw_name)
                formula = calc.attrib.get("formula", "")

                # Replace internal names with captions
                formula = self._replace_field_names(formula)

                # Extract dependencies
                ingredients, param_deps = self._extract_dependencies(formula)
                
                # Determine field type
                field_type, is_table_calc, lod_type = self._determine_field_type(formula)

                # Create field
                field = CalculatedField(
                    datasource=ds_name,
                    field_name=field_name,
                    formula=formula,
                    ingredients=sorted(list(ingredients)),
                    parameter_dependencies=sorted(list(param_deps)),
                    field_type=field_type,
                    is_table_calc=is_table_calc,
                    lod_type=lod_type
                )

                self.calculated_fields.append(field)

    def _replace_field_names(self, formula: str) -> str:
        """Replace internal field names with display captions"""
        # Replace parameter references
        for internal, display in self.parameter_internal_map.items():
            # Handle [Parameters].[Parameter Name] syntax
            formula = re.sub(
                r'\[Parameters\]\.\s*' + re.escape(internal),
                f'[{display}]',
                formula,
                flags=re.IGNORECASE
            )
            # Handle direct [Parameter 1] references
            formula = formula.replace(internal, f'[{display}]')
        
        # Replace regular fields
        for internal_name, caption in self.field_map.items():
            formula = formula.replace(internal_name, f"[{caption}]")

        return formula

    def _extract_dependencies(self, formula: str) -> Tuple[Set[str], Set[str]]:
        """Extract field and parameter dependencies separately"""
        pattern = r"\[([^\]]+)\]"
        matches = re.findall(pattern, formula)

        field_deps = set()
        param_deps = set()

        for match in matches:
            if match in self.parameter_names:
                param_deps.add(match)
            else:
                field_deps.add(match)

        return field_deps, param_deps

    def _determine_field_type(self, formula: str) -> Tuple[str, bool, str]:
        """Determine field type, table calc status, and LOD type"""
        formula_upper = formula.upper()
        
        # Check for table calculations
        is_table_calc = any(func in formula_upper for func in TABLE_CALC_FUNCTIONS)
        
        # Check for LOD expressions
        lod_type = None
        if 'FIXED' in formula_upper and '{' in formula:
            lod_type = 'FIXED'
        elif 'INCLUDE' in formula_upper and '{' in formula:
            lod_type = 'INCLUDE'
        elif 'EXCLUDE' in formula_upper and '{' in formula:
            lod_type = 'EXCLUDE'
        
        # Determine field type
        if lod_type:
            field_type = 'lod'
        elif is_table_calc:
            field_type = 'table_calc'
        else:
            field_type = 'calculated'
        
        return field_type, is_table_calc, lod_type

    def _identify_raw_fields(self):
        """Identify raw (non-calculated) fields"""
        all_referenced = set()
        calculated_names = set(f.field_name for f in self.calculated_fields)
        
        for field in self.calculated_fields:
            all_referenced.update(field.ingredients)
        
        self.raw_fields = all_referenced - calculated_names - self.parameter_names

    def get_parameters(self) -> List[Dict[str, Any]]:
        """Get extracted parameters"""
        return self.parameters

    def compute_stats(self, metadata: List[CalculatedField]) -> Dict[str, int]:
        """Compute statistics"""
        datasources = set()
        lod = 0
        table_calcs = 0

        for field in metadata:
            datasources.add(field.datasource)
            if field.lod_type:
                lod += 1
            if field.is_table_calc:
                table_calcs += 1

        return {
            "datasources": len(datasources),
            "calculated_fields": len(metadata),
            "raw_fields": len(self.raw_fields),
            "parameters": len(self.parameters),
            "lod_fields": lod,
            "table_calcs": table_calcs,
            "total_fields": len(metadata) + len(self.raw_fields)
        }

    def __del__(self):
        """Cleanup executor on deletion"""
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=False)


# Legacy compatibility function
def extract_tableau_metadata(twbx_path: str) -> List[Dict]:
    """
    Legacy synchronous extraction function for backwards compatibility

    Args:
        twbx_path: Path to .twbx file

    Returns:
        List of dictionaries with field metadata
    """
    extractor = TableauExtractor()
    fields = extractor._extract_metadata_sync(twbx_path)

    # Convert to dict format for backwards compatibility
    return [field.model_dump() for field in fields]