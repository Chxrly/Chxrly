# Proyecto Power BI (formato PBIP)

**Requiere Power BI Desktop actualizado** (versión 2024 o posterior).

1. Descomprime la carpeta completa y abre `MantencionCD.pbip` (doble clic).
2. `Inicio → Transformar datos → Editar parámetros` → pega la URL de tu
   Google Sheet en `URL_GoogleSheets` → `Inicio → Actualizar` (pedirá
   iniciar sesión con Google la primera vez).
3. El modelo ya trae: las 5 consultas, las relaciones, la tabla Calendario,
   la columna semáforo y las 35 medidas. Las 7 páginas están creadas y
   vacías: arma los visuales siguiendo `docs/GUIA_PASO_A_PASO.md` y las
   maquetas de `docs/img/`.
4. Aplica el tema `tema/tema_mantencion.json` (Ver → Temas) y marca
   Calendario como tabla de fechas si Desktop lo pide.
5. Guarda como `.pbix` (Archivo → Guardar como) para publicarlo.

Si tu versión de Desktop no abre el proyecto, usa el camino manual de la
guía (mismo resultado, ~30-45 min).
