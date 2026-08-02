// Consulta: Bitacora  (método CSV por enlace — requiere parámetro ID_Hoja, ver LEEME.md)
let
    Url = "https://docs.google.com/spreadsheets/d/" & ID_Hoja & "/gviz/tq?tqx=out:csv&sheet=Bitacora",
    Origen = Csv.Document(Web.Contents(Url), [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true]),
    Columnas = Table.SelectColumns(
        Encabezados,
        {"Fecha", "Turno", "Tecnico", "ID_Maquina", "Tipo_Actividad", "Descripcion",
         "Estado_Maquina", "Detencion_Min", "Pendiente", "Observaciones"},
        MissingField.UseNull
    ),
    SinVacias = Table.SelectRows(Columnas, each [Fecha] <> null and [Fecha] <> ""),
    Limpieza = Table.ReplaceValue(SinVacias, "", null, Replacer.ReplaceValue, {"Detencion_Min"}),
    Tipos = Table.TransformColumnTypes(
        Limpieza,
        {{"Fecha", type date}, {"Turno", type text}, {"Tecnico", type text},
         {"ID_Maquina", type text}, {"Tipo_Actividad", type text}, {"Descripcion", type text},
         {"Estado_Maquina", type text}, {"Detencion_Min", Int64.Type},
         {"Pendiente", type text}, {"Observaciones", type text}},
        "es-CL"
    )
in
    Tipos
