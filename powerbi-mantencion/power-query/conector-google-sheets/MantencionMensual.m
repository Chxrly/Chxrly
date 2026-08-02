// ============================================================================
// Consulta: MantencionMensual   (conector nativo de Google Sheets)
// Requiere el parámetro URL_GoogleSheets (ver Bitacora.m).
// ============================================================================
let
    Origen = GoogleSheets.Contents(URL_GoogleSheets),
    Hoja = Origen{[name = "MantencionMensual", ItemKind = "Sheet"]}[Data],
    Encabezados = Table.PromoteHeaders(Hoja, [PromoteAllScalars = true]),
    Columnas = Table.SelectColumns(
        Encabezados,
        {"ID_OT", "ID_Maquina", "Tarea", "Frecuencia", "Fecha_Programada",
         "Fecha_Realizada", "Estado", "Tecnico", "Duracion_Min", "Observaciones"},
        MissingField.UseNull
    ),
    SinVacias = Table.SelectRows(Columnas, each [ID_OT] <> null and [ID_OT] <> ""),
    Limpieza = Table.ReplaceValue(SinVacias, "", null, Replacer.ReplaceValue,
        {"Fecha_Realizada", "Duracion_Min"}),
    Tipos = Table.TransformColumnTypes(
        Limpieza,
        {{"ID_OT", type text}, {"ID_Maquina", type text}, {"Tarea", type text},
         {"Frecuencia", type text}, {"Fecha_Programada", type date},
         {"Fecha_Realizada", type date}, {"Estado", type text}, {"Tecnico", type text},
         {"Duracion_Min", Int64.Type}, {"Observaciones", type text}},
        "es-CL"
    )
in
    Tipos
