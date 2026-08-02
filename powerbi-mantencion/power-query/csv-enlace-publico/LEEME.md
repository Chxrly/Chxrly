# Método alternativo: exportación CSV por enlace

Estas consultas leen cada pestaña con la URL de exportación CSV de Google
(`.../gviz/tq?tqx=out:csv&sheet=NombrePestaña`). No piden credenciales y la
actualización programada en Power BI Service funciona sin puerta de enlace.

**Requisito:** en Google Sheets, `Compartir → Acceso general → Cualquier
persona con el enlace: Lector`.

> ⚠️ **Privacidad:** cualquiera que consiga el enlace podrá ver los datos.
> Para una bitácora interna suele ser aceptable, pero si la empresa lo
> prohíbe, usa el método recomendado (`../conector-google-sheets/`), que
> mantiene la hoja privada con inicio de sesión de Google.

**Requisito previo:** crear un parámetro de texto llamado `ID_Hoja`
(Inicio → Administrar parámetros → Nuevo parámetro) con el ID del documento:
en la URL `https://docs.google.com/spreadsheets/d/`**`ESTE_TRAMO`**`/edit`,
el ID es el tramo entre `/d/` y `/edit`.

Luego, para cada archivo `.m` de esta carpeta: Inicio → Obtener datos →
Consulta en blanco → Editor avanzado → pegar el contenido → renombrar la
consulta exactamente como el archivo (Bitacora, Fallas, MantencionMensual,
Maquinas).
