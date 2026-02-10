import zipfile
import xml.etree.ElementTree as ET
import os
import re
import json


def extract_tableau_metadata(twbx_path):
    metadata = []

    with zipfile.ZipFile(twbx_path, "r") as z:
        twb_file = next((f for f in z.namelist() if f.endswith(".twb")), None)
        if not twb_file:
            raise ValueError("No .twb file found inside .twbx")

        xml_content = z.read(twb_file)
        root = ET.fromstring(xml_content)

        field_map = {}
        for col in root.findall(".//column"):
            name = col.attrib.get("name")
            caption = col.attrib.get("caption")
            if name and caption:
                field_map[name] = caption

        for datasource in root.findall(".//datasource"):
            ds_name = datasource.attrib.get("name", "Unknown")

            for col in datasource.findall(".//column"):
                calc = col.find("calculation")
                if calc is None:
                    continue

                raw_name = col.attrib.get("name")
                field_name = col.attrib.get("caption", raw_name)
                formula = calc.attrib.get("formula", "")

                for k, v in field_map.items():
                    formula = formula.replace(k, "[" + v + "]")

                deps = re.findall(r"\[([^\]]+)\]", formula)

                metadata.append({
                    "datasource": ds_name,
                    "field_name": field_name,
                    "formula": formula,
                    "ingredients": sorted(set(deps))
                })

    return metadata


def generate_pro_dashboard(metadata):
    # Resolve absolute path safely
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    HTML_PATH = os.path.join(BASE_DIR, "..", "Tableau_Metadata_Visualizer.html")

    if not os.path.exists(HTML_PATH):
        raise FileNotFoundError("HTML template not found at: " + HTML_PATH)

    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    html = re.sub(
        r"const data\s*=\s*\[.*?\];",
        "const data = " + json.dumps(metadata) + ";",
        html,
        flags=re.DOTALL
    )

    return html

