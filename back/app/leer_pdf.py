import re, pdfplumber
from typing import List, Dict

PAT_FILA = re.compile(r"^(.*?)\s*[\s\u00A0\t]+([\d.,]+)\s*$")

def extraer_gastos() -> List[Dict[str, float]]:
    filas, encontrado = [], False
    with pdfplumber.open("app/MZO135491.PDF") as pdf:
        for page in pdf.pages:
            for linea in (page.extract_text() or "").splitlines():
                linea = linea.replace("\u00A0", " ").rstrip()
                l = linea.lower()
                if "gastos comprobados" in l:
                    encontrado = True
                    continue
                if encontrado:
                    if l.startswith("total cuenta"):
                        return filas
                    if l.startswith("concepto"):
                        continue
                    if m := PAT_FILA.match(linea):
                        desc, monto = m.groups()
                        filas.append({
                            "descripcion": desc.strip(),
                            "monto": float(monto.replace(",", "")),
                        })
            if encontrado:
                continue
    if not filas:
        raise ValueError("Sección 'Gastos Comprobados' no encontrada")
    return filas
