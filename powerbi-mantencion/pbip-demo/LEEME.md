# Power BI modelado — versión DEMO (sin conexión)

Abre `MantencionCD.pbip` con Power BI Desktop (2024+). **Carga al instante,
sin credenciales**: los datos de ejemplo (flota real: LGV, satélites,
conveyors, Joloda, cargadores) vienen incrustados en las consultas.

Ya incluye: 6 tablas, 7 relaciones, Calendario, columna semáforo, 35
medidas y las 7 páginas creadas (vacías, para armar los visuales con
`docs/GUIA_PASO_A_PASO.md` y las maquetas de `docs/img/`).

## Conectar tu Google Sheet (cuando quieras)
Por cada consulta (Bitacora, Fallas, MantencionMensual, Maquinas, Pautas):
`Transformar datos → clic derecho en la consulta → Editor avanzado` →
reemplazar TODO por el archivo homónimo de
`power-query/conector-google-sheets/` → crear antes el parámetro
`URL_GoogleSheets` (Administrar parámetros) con la URL de tu hoja
**guardada como hoja de cálculo de Google** (no .xlsx). Las medidas,
relaciones y visuales no se tocan: los nombres de columnas son idénticos.
