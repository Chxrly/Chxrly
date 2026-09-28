"""Genera matrix-data.js a partir de las bibliotecas MATRIX.

Uso:  python3 tools/build_matrix_data.py <Biblioteca_Maestra.xlsx> <Si_1.docx> [salida.js]

Fuente prioritaria: Biblioteca Maestra v1.x (arcanos, 32 puntos, contextos, zonas,
programas publicables, 26 colas). El .docx aporta el diccionario semántico
Arcano × tipo de zona y los núcleos de programas. Los registros en cuarentena
(Documentado_Publicable = NO) nunca se exportan.
"""
import json, re, sys, collections
import openpyxl, docx

MAESTRA, DOCX = sys.argv[1], sys.argv[2]
OUT = sys.argv[3] if len(sys.argv) > 3 else "matrix-data.js"

wb = openpyxl.load_workbook(MAESTRA, read_only=True, data_only=True)
def sheet(name):
    rows = list(wb[name].iter_rows(values_only=True))
    return [dict(zip(rows[0], r)) for r in rows[1:] if r[0] is not None]
def clean(v):
    return re.sub(r"\s+", " ", str(v)).strip() if v is not None else ""

# ---- 22 Arcanos canónicos ----
ARC = {}
for a in sheet("01_ARCANOS"):
    ARC[int(a["Arcano_ID"])] = dict(n=clean(a["Nombre"]), rec=clean(a["Recurso_Integrado"]),
        hipo=clean(a["Hipo"]), hiper=clean(a["Hiper"]), clave=clean(a["Clave_Integracion"]))
assert len(ARC) == 22

# ---- 32 puntos ----
PTS = {}
for p in sheet("02_PUNTOS"):
    PTS[clean(p["Punto"])] = dict(zona=clean(p["Zona_Principal"]), func=clean(p["Funcion_Canonica"]),
        geo=clean(p["Geometria"]), formula=clean(p["Formula"]))
assert len(PTS) == 32

# ---- 35 contextos: se derivan plantillas y se verifica que reproducen los 770 párrafos ----
INT = sheet("05_INTERPRETACIONES")
CTX = collections.OrderedDict()
for r in INT:
    cid = clean(r["Contexto_ID"])
    if cid in CTX: continue
    a = ARC[int(r["Arcano_ID"])]
    t = clean(r["Parrafo_Editorial"])
    for key in ("rec", "hipo", "hiper", "clave", "n"):     # los campos largos primero
        t = t.replace(a[key], "{" + key + "}")
    CTX[cid] = dict(punto=clean(r["Punto"]), zona=clean(r["Zona_ID"]), func=clean(r["Funcion"]), tpl=t)
def render(tpl, a): return re.sub(r"\{(\w+)\}", lambda m: a[m.group(1)], tpl)
bad = [r["ID"] for r in INT if render(CTX[clean(r["Contexto_ID"])]["tpl"], ARC[int(r["Arcano_ID"])]) != clean(r["Parrafo_Editorial"])]
assert not bad, f"plantillas no reproducen: {bad[:5]}"

# ---- Zonas y secuencias de activación (orden importa) ----
ZON = {}
for z in sheet("03_ZONAS"):
    ZON[clean(z["Zona_ID"])] = dict(nombre=clean(z["Nombre"]), puntos=clean(z["Puntos"]), lectura=clean(z["Lectura"]))
SEQ = [dict(id=clean(z["Zona_ID"]), nombre=clean(z["Zona"]), pts=[clean(z["Punto_1"]), clean(z["Punto_2"]), clean(z["Punto_3"])])
       for z in sheet("09_REGLAS_ACTIVACION")]

# ---- Lente de zona para programas (se extrae de las expresiones programa×zona) ----
LENS = {}
for z in sheet("08_PROGRAMA_ZONA"):
    m = re.search(r"se interpreta aquí en relación con (.+?), sin trasladar|se interpreta en relación con (.+?)\. Como", clean(z["Expresion_Contextual"]))
    if m: LENS.setdefault(clean(z["Zona_ID"]), (m.group(1) or m.group(2)))

# ---- Programas publicables (excluye cuarentena) y 26 colas ----
PRG = []
for p in sheet("06_PROGRAMAS"):
    if clean(p["Documentado_Publicable"]) != "SI": continue
    PRG.append(dict(code=clean(p["Codigo"]), ar=int(p["Aridad"]), cat=clean(p["Categoria"]),
        nombre=clean(p["Nombre_Producto"]) or clean(p["Nombre_Canonico"]), trad=clean(p["Nombre_Canonico"]),
        rec=clean(p["Recurso"]), sombra=clean(p["Sombra_Bloqueo"]), tarea=clean(p["Tarea_Integracion"]),
        cola26=clean(p["Es_Cola26"]) == "SI", aviso=clean(p["Advertencia_Publicacion"])))
COL = []
for c in sheet("07_COLAS_26"):
    COL.append(dict(code=clean(c["Codigo"]), nombre=clean(c["Nombre_Producto"]) or clean(c["Nombre"]), trad=clean(c["Nombre"]),
        rec=clean(c["Recurso"]), sombra=clean(c["Sombra"]), integ=clean(c["Integracion"]), aviso=clean(c["Advertencia_Publicacion"])))
assert len(COL) == 26

# ---- Arcano anual (interpretación temporal) ----
ANU = {int(a["Arcano_ID"]): clean(a["Interpretacion_Anual"]) for a in sheet("16_ARCANO_ANUAL")
       if str(a["Arcano_ID"]).isdigit() and clean(a["Tipo"]) == "INTERPRETACION_TEMPORAL"}

# ---- .docx: diccionario Arcano × tipo de zona + núcleos de programas ----
d = docx.Document(DOCX)
KEYS = [("Retrato", "retrato"), ("Talentos", "talentos"), ("Centro", "centro"), ("Linaje paterno", "linPat"),
        ("Linaje materno", "linMat"), ("Amor", "amor"), ("Dinero", "dinero"), ("Repetición", "repeticion"),
        ("Propósito/ciclo", "proposito")]
DIC = {}
for para in d.paragraphs:
    m = re.match(r"Arcano (\d+) — [^.]+\.\s*(.*)", para.text.strip())
    if not m: continue
    body = re.sub(r"\s*Astro Lúdico usa[^.]*\.", "", m.group(2))          # notas de fuente, no contenido
    idx = [(body.find(k + ":"), k, key) for k, key in KEYS]
    idx = sorted(i for i in idx if i[0] >= 0)
    DIC[int(m.group(1))] = {key: body[pos + len(k) + 1: (idx[j + 1][0] if j + 1 < len(idx) else None)].strip()
                            for j, (pos, k, key) in enumerate(idx)}
assert len(DIC) == 22 and all(len(v) == 9 for v in DIC.values()), {k: len(v) for k, v in DIC.items()}
NUC = {}
for tb in d.tables:
    hdr = [c.text.strip() for c in tb.rows[0].cells]
    if hdr[:2] != ["Código", "Programa"]: continue
    for row in tb.rows[1:]:
        code, name, defi = (c.text.strip() for c in row.cells)
        NUC[code] = dict(nombre=name, def_=clean(defi))
ZONE_Q = {}
for tb in d.tables:
    hdr = [c.text.strip() for c in tb.rows[0].cells]
    if hdr == ["Zona", "Qué parte del programa se interpreta"]:
        for row in tb.rows[1:]: ZONE_Q[row.cells[0].text.strip()] = clean(row.cells[1].text)

data = dict(version="MATRIX Biblioteca Maestra v1.12 + diccionario semántico", arc=ARC, pts=PTS, ctx=CTX, zon=ZON,
            seq=SEQ, lens=LENS, prg=PRG, col=COL, anual=ANU, dic=DIC, nuc=NUC, zoneQ=ZONE_Q)
js = "/* Generado por tools/build_matrix_data.py — no editar a mano. */\nwindow.MATRIX_DATA=" + \
     json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("def_", "def") + ";\n"
open(OUT, "w", encoding="utf-8").write(js)
print(f"OK {OUT}: {len(js)/1024:.0f} KB | arcanos {len(ARC)} · puntos {len(PTS)} · contextos {len(CTX)} (770 párrafos verificados) · "
      f"zonas {len(ZON)} · secuencias {len(SEQ)} · lentes {len(LENS)} · programas publicables {len(PRG)} · colas {len(COL)} · "
      f"anual {len(ANU)} · diccionario {len(DIC)}×9 · núcleos docx {len(NUC)} · zonas docx {len(ZONE_Q)}")
