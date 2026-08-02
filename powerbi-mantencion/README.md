# 📊 Dashboard de Mantención — Centro de Distribución Automatizado

Kit completo para montar un **dashboard de Power BI conectado a Google
Sheets** para el área de mantención de un CD automatizado: bitácora de cada
turno, registro de fallas y reparaciones, y control del cumplimiento de la
mantención mensual (preventiva) de las máquinas.

![Vista general — Bitácora del turno](docs/img/pagina-1-bitacora.png)

## Qué resuelve

- **Bitácora de turno**: qué se hizo en cada turno (Mañana/Tarde/Noche), en
  qué estado quedó cada máquina y qué quedó pendiente para el turno siguiente.
- **Fallas y reparaciones**: qué máquina quedó en falla, cuánto tiempo de
  detención genera cada equipo (Pareto), MTTR, disponibilidad y el backlog de
  fallas abiertas que se arrastran entre turnos.
- **Mantención mensual**: si el plan preventivo se está cumpliendo, máquina
  por máquina y mes a mes, con OT atrasadas y reprogramadas a la vista.
- **Reporte diario del turno**: un día a la vista — fallas por equipo,
  minutos y razón de inactividad, solución aplicada en el turno, mantenciones
  por clase (preventiva · correctiva · rutina) y traspaso al turno entrante.
- **Resumen KPI para gerencia**: cada indicador contra su meta y el benchmark
  de clase mundial (SMRP), con semáforo y tendencia: disponibilidad,
  % trabajo planificado, cumplimiento PM, MTTR, reincidencias y backlog.

## Contenido del kit

```
powerbi-mantencion/
├── plantilla/
│   └── Plantilla_Bitacora_Mantencion.xlsx   ← subir a Google Sheets (5 pestañas,
│                                              listas desplegables y datos de ejemplo)
├── power-query/
│   ├── conector-google-sheets/              ← consultas M, método recomendado (hoja privada)
│   └── csv-enlace-publico/                  ← consultas M, método alternativo sin credenciales
├── dax/
│   ├── 01_tabla_calendario.dax              ← dimensión de fechas
│   ├── 02_medidas.dax                       ← 35 medidas: MTTR, MTBF, disponibilidad,
│   │                                          % trabajo planificado, reincidencias, etc.
│   └── 03_columna_estado_ejecucion.dax      ← semáforo para la matriz de cumplimiento
├── tema/
│   └── tema_mantencion.json                 ← tema visual de Power BI (paleta accesible)
└── docs/
    ├── GUIA_PASO_A_PASO.md                  ← ★ empezar aquí
    ├── INVESTIGACION_KPI.md                 ← benchmarks del rubro (SMRP) y diseño de
    │                                          dashboards profesionales, con fuentes
    └── img/                                 ← maquetas de las 5 páginas
```

## Cómo empezar (resumen)

1. **Google Sheets** — sube `plantilla/Plantilla_Bitacora_Mantencion.xlsx` a
   Drive y guárdala como hoja de cálculo de Google. Ajusta tus máquinas y
   técnicos.
2. **Power BI** — crea el parámetro `URL_GoogleSheets`, pega las 4 consultas
   de `power-query/conector-google-sheets/` y aplica.
3. **Modelo** — crea la tabla `Calendario`, las relaciones y las medidas
   (`dax/`).
4. **Páginas** — aplica `tema/tema_mantencion.json` y construye las 5 páginas
   siguiendo las maquetas y las tablas visual-por-visual de la guía.
5. **Publica** — sube al Power BI Service y programa la actualización
   automática (origen en la nube, sin puerta de enlace).

La guía completa, con capturas y solución de problemas:
**[docs/GUIA_PASO_A_PASO.md](docs/GUIA_PASO_A_PASO.md)**

## Las 5 páginas del dashboard

| | |
|---|---|
| ![Página 2](docs/img/pagina-2-fallas.png) | ![Página 3](docs/img/pagina-3-mantencion.png) |
| ![Página 4](docs/img/pagina-4-reporte-diario.png) | ![Página 5](docs/img/pagina-5-resumen-kpi.png) |

**KPIs incluidos:** actividades por turno · pendientes entre turnos ·
máquinas detenidas · horas de detención · N° de fallas y fallas abiertas ·
MTTR · MTBF · disponibilidad estimada · cumplimiento del plan mensual ·
puntualidad de OT · OT atrasadas y próximas · horas de mantención preventiva ·
mantenciones por clase (preventiva / correctiva / rutina) · inactividad por
razón · **% trabajo planificado (SMRP)** · **reincidencias 30 d** ·
**edad del backlog** · **% resueltas el mismo día** — todos con benchmark de
referencia en [docs/INVESTIGACION_KPI.md](docs/INVESTIGACION_KPI.md).

> Los datos de la plantilla son de ejemplo (junio–agosto 2026) para que el
> dashboard se vea poblado al primer intento; bórralos al pasar a producción.
