// ============================================================================
// Consulta: Fallas   (método recomendado: conector nativo de Google Sheets)
// Requiere el parámetro URL_GoogleSheets (ver Bitacora.m).
// Incluye la columna derivada "Fecha" (día de la falla) para relacionar con
// la tabla Calendario.
// ============================================================================
let
    Origen = GoogleSheets.Contents(URL_GoogleSheets),
    Hoja = Origen{[name = "Fallas", ItemKind = "Sheet"]}[Data],
    Encabezados = Table.PromoteHeaders(Hoja, [PromoteAllScalars = true]),
    Columnas = Table.SelectColumns(
        Encabezados,
        {"ID_Falla", "Fecha_Hora_Falla", "ID_Maquina", "Turno_Detecta", "Tipo_Falla",
         "Severidad", "Descripcion_Falla", "Estado", "Fecha_Hora_Cierre", "Detencion_Min",
         "Reparacion_Realizada", "Repuestos_Usados", "Tecnico_Responsable"},
        MissingField.UseNull
    ),
    SinVacias = Table.SelectRows(Columnas, each [ID_Falla] <> null and [ID_Falla] <> ""),
    Limpieza = Table.ReplaceValue(SinVacias, "", null, Replacer.ReplaceValue,
        {"Fecha_Hora_Cierre", "Detencion_Min"}),
    Tipos = Table.TransformColumnTypes(
        Limpieza,
        {{"ID_Falla", type text}, {"Fecha_Hora_Falla", type datetime}, {"ID_Maquina", type text},
         {"Turno_Detecta", type text}, {"Tipo_Falla", type text}, {"Severidad", type text},
         {"Descripcion_Falla", type text}, {"Estado", type text},
         {"Fecha_Hora_Cierre", type datetime}, {"Detencion_Min", Int64.Type},
         {"Reparacion_Realizada", type text}, {"Repuestos_Usados", type text},
         {"Tecnico_Responsable", type text}},
        "es-CL"
    ),
    // Día de la falla, para la relación con Calendario[Fecha]
    ConFecha = Table.AddColumn(Tipos, "Fecha", each Date.From([Fecha_Hora_Falla]), type date)
in
    ConFecha
