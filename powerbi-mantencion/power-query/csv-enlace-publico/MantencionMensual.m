// Consulta: MantencionMensual  (método CSV por enlace — requiere parámetro ID_Hoja, ver LEEME.md)
let
    Url = "https://docs.google.com/spreadsheets/d/" & ID_Hoja & "/gviz/tq?tqx=out:csv&sheet=MantencionMensual",
    Origen = Csv.Document(Web.Contents(Url), [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true]),
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
