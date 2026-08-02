// Consulta: Pautas  (método CSV por enlace — requiere parámetro ID_Hoja, ver LEEME.md)
// Tras cargar: columna Link_Pauta > Categoría de datos > "Dirección URL web".
let
    Url = "https://docs.google.com/spreadsheets/d/" & ID_Hoja & "/gviz/tq?tqx=out:csv&sheet=Pautas",
    Origen = Csv.Document(Web.Contents(Url), [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true]),
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
