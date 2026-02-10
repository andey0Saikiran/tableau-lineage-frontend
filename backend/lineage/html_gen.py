"""
HTML Visualization Generator v3.0 - COMPLETE & FINAL
Handles ALL placeholders from notebook template
"""
import json
import re
import html as html_module
import asyncio
from pathlib import Path
from typing import List, Optional, Dict, Any

from .models import CalculatedField


class HTMLGeneratorError(Exception):
    """Custom exception for HTML generation errors"""
    pass


class HTMLGenerator:
    """Generates interactive HTML visualizations - matches notebook 100%"""

    def __init__(self, template_path: Optional[str] = None):
        self.template_path = template_path
        self._template_cache = None
        self._cache_lock = asyncio.Lock()

    async def _get_template(self) -> str:
        """Thread-safe lazy-load and cache HTML template"""
        if self._template_cache is not None:
            return self._template_cache

        async with self._cache_lock:
            # Double-check after acquiring lock
            if self._template_cache is not None:
                return self._template_cache

            template_path = self._resolve_template_path()

            try:
                with open(template_path, "r", encoding="utf-8") as f:
                    self._template_cache = f.read()
                return self._template_cache
            except FileNotFoundError:
                raise HTMLGeneratorError(f"Template not found: {template_path}")
            except Exception as e:
                raise HTMLGeneratorError(f"Failed to load template: {str(e)}")

    @property
    def template(self) -> str:
        """Synchronous template accessor (for backward compatibility)"""
        if self._template_cache is not None:
            return self._template_cache

        template_path = self._resolve_template_path()

        try:
            with open(template_path, "r", encoding="utf-8") as f:
                self._template_cache = f.read()
            return self._template_cache
        except FileNotFoundError:
            raise HTMLGeneratorError(f"Template not found: {template_path}")
        except Exception as e:
            raise HTMLGeneratorError(f"Failed to load template: {str(e)}")

    def _resolve_template_path(self) -> Path:
        if self.template_path:
            return Path(self.template_path)
        base_dir = Path(__file__).parent.parent
        return base_dir / "Tableau_Metadata_Visualizer.html"

    def generate(
        self,
        metadata: List[CalculatedField],
        filename: str = "Tableau Workbook",
        parameters: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Generate HTML - matching notebook's placeholder replacement exactly"""
        try:
            html = self.template
            params = parameters or []

            # Serialize data
            data_json = self._serialize_metadata(metadata)
            params_json = self._serialize_parameters(params)

            # Calculate statistics (matching notebook)
            datasources = list(set([f.datasource for f in metadata]))
            raw_fields = self._get_raw_fields(metadata)
            type_counts = self._count_by_type(metadata)

            # Replace JavaScript data placeholders
            html = html.replace('{json_data}', data_json)
            html = html.replace('{params_json}', params_json)
            html = html.replace('{parameters_json}', params_json)

            # Replace HTML content placeholders (matching notebook)
            file_label = filename.replace('.twbx', '').replace('.twb', '')
            html = html.replace('{html.escape(file_label)}', html_module.escape(file_label))
            html = html.replace('{len(datasources)}', str(len(datasources)))
            html = html.replace('{total_fields}', str(len(metadata)))
            html = html.replace('{len(raw_fields)}', str(len(raw_fields)))
            html = html.replace('{total_params}', str(len(params)))
            html = html.replace("{type_counts.get('lod_expression', 0)}", str(type_counts.get('lod', 0)))
            html = html.replace("{type_counts.get('table_calculation', 0)}", str(type_counts.get('table_calc', 0)))

            # Replace title
            html = self._inject_title(html, filename)

            # Handle warnings placeholder
            html = html.replace('{warnings_html}', '')

            print(f"✅ Generated HTML: {len(html):,} chars")
            print(f"✅ Data: {len(metadata)} fields, {len(datasources)} datasources")
            print(f"✅ Parameters: {len(params)}")
            print(f"✅ LOD: {type_counts.get('lod', 0)}, Table Calcs: {type_counts.get('table_calc', 0)}")

            return html

        except Exception as e:
            print(f"❌ HTML generation failed: {str(e)}")
            raise HTMLGeneratorError(f"Failed to generate HTML: {str(e)}")

    def _serialize_metadata(self, metadata: List[CalculatedField]) -> str:
        """Serialize metadata to JSON"""
        data = [field.model_dump() for field in metadata]
        return json.dumps(data, ensure_ascii=False, separators=(',', ':'))

    def _serialize_parameters(self, parameters: List[Dict[str, Any]]) -> str:
        """Serialize parameters to JSON"""
        return json.dumps(parameters, ensure_ascii=False, separators=(',', ':'))

    def _get_raw_fields(self, metadata: List[CalculatedField]) -> set:
        """Get all raw (non-calculated) fields"""
        all_referenced = set()
        calculated_names = set(f.field_name for f in metadata)
        param_names = set()
        
        for field in metadata:
            all_referenced.update(field.ingredients)
            param_names.update(field.parameter_dependencies)
        
        return all_referenced - calculated_names - param_names

    def _count_by_type(self, metadata: List[CalculatedField]) -> Dict[str, int]:
        """Count fields by type"""
        counts = {'lod': 0, 'table_calc': 0, 'calculated': 0}
        for field in metadata:
            if field.lod_type:
                counts['lod'] += 1
            elif field.is_table_calc:
                counts['table_calc'] += 1
            else:
                counts['calculated'] += 1
        return counts

    def _inject_title(self, html: str, filename: str) -> str:
        """Inject filename into HTML title"""
        pattern = r"<title>.*?</title>"
        replacement = f"<title>Tableau Metadata: {filename}</title>"
        return re.sub(pattern, replacement, html, count=1)

    def clear_cache(self):
        """Clear the template cache"""
        self._template_cache = None


def generate_pro_dashboard(metadata: List[dict]) -> str:
    """Legacy function for backwards compatibility"""
    fields = [CalculatedField(**item) for item in metadata]
    generator = HTMLGenerator()
    return generator.generate(fields)