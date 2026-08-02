# Investigación — KPIs y dashboards profesionales de mantención

Resumen de la investigación que respalda los indicadores y el diseño de este
kit: qué mide la industria, contra qué benchmark se compara, y cómo se ven
los dashboards profesionales del área (CMMS/GMAO y reportería ejecutiva de
mantenimiento). Fuentes al final.

## 1. El marco de referencia: SMRP

La [SMRP (Society for Maintenance & Reliability Professionals)](https://smrp.org/Learning-Resources/SMRP-Library/Best-Practices-Metrics-Guidelines)
mantiene el compendio de métricas estándar del rubro (SMRP Best Practices),
que define fórmulas consistentes para comparar entre plantas e industrias.
Los KPIs de este kit siguen ese marco.

## 2. Benchmarks de clase mundial

| KPI | Qué mide | Promedio industria | Clase mundial | Estado en el kit |
|---|---|---|---|---|
| **% Trabajo Planificado (PMP)** | Trabajo preventivo+rutina vs correctivo | 50–60 % | **≥ 85–90 %** (bajo 70 % = programa reactivo) | Medida `% Trabajo Planificado` |
| **Cumplimiento PM** | OT preventivas completadas en su ventana | — | **≥ 90 %** (≥ 95 % en equipos críticos; < 80 % = programa no funciona, SMRP 6ª ed.) | Medida `Cumplimiento PM %` + matriz página 3 |
| **Cumplimiento de programa** | Trabajo programado de la semana ejecutado | — | **≥ 90 %** | `Puntualidad PM %` (aprox. mensual) |
| **MTTR** | Tiempo medio de reparación | — | **< 4 h** en equipos críticos | Medida `MTTR Horas` |
| **MTBF** | Tiempo medio entre fallas | 200–400 días por equipo | **> 400 días** por equipo | Medida `MTBF Horas` (filtrable por equipo) |
| **Disponibilidad** | Tiempo operativo vs requerido | 93 % aceptable | **≥ 95 %**; flotas automatizadas 24/7 apuntan a ≥ 98 % * | Medida `Disponibilidad %` |
| **Backlog** | Trabajo pendiente acumulado | — | Sano: se resuelve en **3–5 semanas**; vigilar su **edad** | Medidas `Antiguedad Backlog Dias / Max` |
| **Reincidencia** | Fallas que repiten equipo+tipo en 30 días | — | Tendencia a **0** (mide calidad de la reparación) | Medida `Fallas Reincidentes 30d` |
| **Resolución en el día** | Fallas cerradas el mismo día | — | Maximizar (capacidad del turno) | Medida `% Fallas Resueltas Mismo Dia` |

\* No existe un benchmark público único para flotas AGV/LGV; los proveedores
del rubro (p. ej. [Elettric80](https://www.e80group.com/en/agv-lgv-systems),
[Toyota Automated Logistics](https://toyota-automated-logistics.com/technology/agv-amr-systems))
estructuran su servicio en torno a maximizar uptime con soporte 24/7,
monitoreo diario de baterías y mantención preventiva; en sistemas que operan
24/7 la meta interna típica es más exigente que el 95 % general. Ajusta la
meta con tu contrato de servicio.

**Cómo leerlos juntos:** el % de trabajo planificado es el indicador de
*estrategia* (¿dejamos de apagar incendios?); el cumplimiento PM es el de
*disciplina* (¿hacemos lo que planificamos?); MTTR/MTBF/disponibilidad son
el *resultado* (¿las máquinas responden?); reincidencia y edad del backlog
son la *calidad* (¿arreglamos de raíz y a tiempo?). Si cumplimiento sube y
el correctivo no baja en 2–3 meses, el plan preventivo está mal diseñado
(tareas o frecuencias equivocadas), no mal ejecutado.

## 3. Cómo se ve un dashboard profesional del área

Prácticas repetidas en la literatura de CMMS y reportería de mantenimiento
([eWorkOrders](https://eworkorders.com/cmms-kpi-dashboards-guide/),
[FanRuan](https://www.fanruan.com/en/blog/cmms-dashboard),
[MPulse](https://mpulsesoftware.com/blog/cmms/role-of-maintenance-reporting-dashboards/),
[Oxmaint](https://oxmaint.com/article/maintenance-kpi-dashboard-15-metrics-operational-excellence),
[f7i.ai](https://f7i.ai/blog/building-a-maintenance-kpi-dashboard-that-actually-drives-decisions-not-just-data)):

1. **Vistas por rol, no una vista para todos.** El técnico mira su turno
   (diario), el supervisor el backlog y el plan (diario/semanal), la gerencia
   tendencias y costo (semanal/mensual). En este kit: páginas 1 y 4 = turno;
   páginas 2 y 3 = supervisión; página 5 = gerencia.
2. **5–7 KPIs por vista, no más.** Cada KPI extra diluye los demás; el
   detalle vive en el drill-down o en la tabla.
3. **Todo KPI se muestra contra su meta**, con semáforo y flecha de
   tendencia: un ejecutivo debe captar dirección en segundos. Un número sin
   meta ni tendencia no es un indicador, es un dato.
4. **Diseñar alrededor de decisiones**: cada visual responde una pregunta
   accionable ("¿a qué equipo mando el próximo técnico?" → Pareto de
   detención; "¿qué OT rescato esta semana?" → atrasadas).
5. **Jerarquía en 4 niveles**: resultado del equipo (disponibilidad,
   MTBF) → ejecución (cumplimiento, backlog) → estrategia (% planificado) →
   impacto financiero (costos, cuando se registren).
6. **Tablas como respaldo de accesibilidad y auditoría**, no como visual
   principal; y colores de estado reservados para estado (verde/ámbar/rojo),
   nunca para series.

La página 5 del kit ("Resumen KPI · Gerencia") aplica estos seis puntos.

## 4. Qué registrar a futuro para subir de nivel

- **Costo de repuestos** (columna en `Fallas` y `MantencionMensual`) →
  Pareto de costo por equipo y costo mensual de mantención; es el puente al
  nivel financiero del punto 5.
- **Horas-hombre por actividad** (columna en `Bitacora`) → utilización de la
  dotación y horas por clase de mantención (hoy solo se mide detención de
  máquina).
- **OEE**: requiere datos de producción (rendimiento y calidad); la pata de
  disponibilidad ya está en el kit.

## Fuentes

- [SMRP — Best Practices, Metrics & Guidelines](https://smrp.org/Learning-Resources/SMRP-Library/Best-Practices-Metrics-Guidelines)
- [eWorkOrders — Preventive Maintenance KPIs](https://eworkorders.com/preventive-maintenance/preventive-maintenance-kpis/) (cumplimiento PM ≥ 90 %, ≥ 95 % críticos, SMRP 6ª ed.)
- [eWorkOrders — CMMS KPI Dashboards Guide](https://eworkorders.com/cmms-kpi-dashboards-guide/) (dashboards por rol)
- [eMaint — Guide to Maintenance KPIs](https://www.emaint.com/works/cmms-kpi/)
- [Sockeye — How to Select Maintenance KPIs](https://www.getsockeye.com/blog/maintenance-kpis-and-metrics/)
- [Oxmaint — Maintenance KPI Dashboard: 15 Metrics](https://oxmaint.com/article/maintenance-kpi-dashboard-15-metrics-operational-excellence) (planificado ≥ 85 %, MTTR < 4 h, MTBF 400+ días, backlog 3–5 semanas, jerarquía de 4 niveles)
- [Tractian — Maintenance KPI glossary](https://tractian.com/en/glossary/maintenance-kpi)
- [Reliamag — Maintenance KPIs That Actually Matter](https://reliamag.com/articles/maintenance-kpis-that-actually-matter/)
- [FanRuan — CMMS Dashboard: Role-Based Guide](https://www.fanruan.com/en/blog/cmms-dashboard) (5–7 KPIs por vista, semáforos y tendencias para ejecutivos)
- [f7i.ai — Building a Maintenance KPI Dashboard](https://f7i.ai/blog/building-a-maintenance-kpi-dashboard-that-actually-drives-decisions-not-just-data) (decisiones, no datos; refresco por rol)
- [MPulse — Role of Maintenance Reporting Dashboards](https://mpulsesoftware.com/blog/cmms/role-of-maintenance-reporting-dashboards/)
- [Elettric80 — AGV/LGV Systems](https://www.e80group.com/en/agv-lgv-systems) · [Toyota Automated Logistics — AGV/AMR](https://toyota-automated-logistics.com/technology/agv-amr-systems) (prácticas de uptime en flotas automatizadas)
