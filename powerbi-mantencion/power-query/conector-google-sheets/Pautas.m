// ============================================================================
// Consulta: Pautas   (conector nativo de Google Sheets)
// Requiere el parámetro URL_GoogleSheets (ver Bitacora.m).
// Pauta de mantención por equipo y frecuencia, con link al documento del
// fabricante. Después de cargar: seleccionar la columna Link_Pauta >
// Herramientas de columna > Categoría de datos > "Dirección URL web".
// ============================================================================
let
    Origen = GoogleSheets.Contents(URL_GoogleSheets),
    Hoja = Origen{[name = "Pautas", ItemKind = "Sheet"]}[Data],
    Encabezados = Table.PromoteHeaders(Hoja, [PromoteAllScalars = true]),
    Columnas = Table.SelectColumns(
        Encabezados,
        {"ID_Pauta", "ID_Maquina", "Frecuencia", "Tarea", "Duracion_Min_Est",
         "Link_Pauta", "Observaciones"},
        MissingField.UseNull
    ),
    SinVacias = Table.SelectRows(Columnas, each [ID_Pauta] <> null and [ID_Pauta] <> ""),
    Limpieza = Table.ReplaceValue(SinVacias, "", null, Replacer.ReplaceValue, {"Duracion_Min_Est"}),
    Tipos = Table.TransformColumnTypes(
        Limpieza,
        {{"ID_Pauta", type text}, {"ID_Maquina", type text}, {"Frecuencia", type text},
         {"Tarea", type text}, {"Duracion_Min_Est", Int64.Type},
         {"Link_Pauta", type text}, {"Observaciones", type text}},
        "es-CL"
    )
in
    Tipos
