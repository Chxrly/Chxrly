"""Oráculo de cálculo: evalúa LITERALMENTE las fórmulas de la hoja 11_MOTOR de la Biblioteca Maestra
(pip install formulas openpyxl) para muchas fechas, y exporta las reglas de 08_PROGRAMA_ZONA y 07_COLAS_26.

Uso: python3 tools/audit/oracle_motor.py <Maestra.xlsx> <carpeta_salida> [paso_en_días=7]
Genera oracle.json (32 puntos por fecha) y rules.json; luego: node tools/audit/audit_matrix.cjs <carpeta_salida>
"""
import sys, json, datetime, openpyxl, formulas, numpy as np, os
src, out = sys.argv[1], sys.argv[2]; step = int(sys.argv[3]) if len(sys.argv) > 3 else 7
os.makedirs(out, exist_ok=True)
wb = openpyxl.load_workbook(src)
m = wb['11_MOTOR']; tmp = openpyxl.Workbook(); ws = tmp.active; ws.title = 'MOTOR'
for row in m.iter_rows():
    for c in row:
        if c.value is not None: ws[c.coordinate] = c.value
motor = os.path.join(out, 'motor.xlsx'); tmp.save(motor)
formulas.get_functions()['QUOTIENT'] = formulas.functions.wrap_ufunc(lambda a, b: float(int(a) // int(b)))
xl = formulas.ExcelModel().loads(motor).finish()
rows = {ws.cell(r, 1).value: r for r in range(7, 39)}
fn = xl.compile(inputs=["'[motor.xlsx]MOTOR'!B2"], outputs=[f"'[motor.xlsx]MOTOR'!D{r}" for r in rows.values()])
base = datetime.date(1899, 12, 30); d = datetime.date(1900, 3, 1); dates = []
while d <= datetime.date(2100, 12, 31): dates.append(d); d += datetime.timedelta(days=step)
dates += [datetime.date(2001, 4, 26), datetime.date(2000, 9, 19), datetime.date(1999, 12, 31), datetime.date(2003, 1, 31), datetime.date(1997, 8, 27)]
res = {}
for dt in dates:
    vals = fn((dt - base).days)
    res[dt.strftime('%d/%m/%Y')] = {k: int(np.asarray(getattr(v, 'value', v)).ravel()[0]) for k, v in zip(rows, vals)}
json.dump(res, open(os.path.join(out, 'oracle.json'), 'w'))
pz = [r for r in wb['08_PROGRAMA_ZONA'].iter_rows(values_only=True)][1:]
rules = [{'zona': r[5], 'seq': r[7].split('-'), 'code': r[2], 'cat': r[3], 'name': r[4], 'adj': 'adyacente' in r[8]} for r in pz if r[0]]
col = [list(r[:4]) for r in wb['07_COLAS_26'].iter_rows(values_only=True)][1:]
json.dump({'rules': rules, 'col': [c for c in col if c[0]]}, open(os.path.join(out, 'rules.json'), 'w'), default=str)
print(len(res), 'fechas ·', len(rules), 'reglas programa×zona')
