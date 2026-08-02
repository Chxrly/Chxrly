// Consulta: Maquinas  (método CSV por enlace — requiere parámetro ID_Hoja, ver LEEME.md)
let
    Url = "https://docs.google.com/spreadsheets/d/" & ID_Hoja & "/gviz/tq?tqx=out:csv&sheet=Maquinas",
    Origen = Csv.Document(Web.Contents(Url), [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true]),
    Columnas = Table.SelectColumns(
        Encabezados,
        {"ID_Maquina", "Nombre", "Tipo", "Zona", "Criticidad", "Fabricante", "Anio_Instalacion"},
        MissingField.UseNull
    ),
    SinVacias = Table.SelectRows(Columnas, each [ID_Maquina] <> null and [ID_Maquina] <> ""),
    Limpieza = Table.ReplaceValue(SinVacias, "", null, Replacer.ReplaceValue, {"Anio_Instalacion"}),
    Tipos = Table.TransformColumnTypes(
        Limpieza,
        {{"ID_Maquina", type text}, {"Nombre", type text}, {"Tipo", type text},
         {"Zona", type text}, {"Criticidad", type text}, {"Fabricante", type text},
         {"Anio_Instalacion", Int64.Type}},
        "es-CL"
    ),
    ConEtiqueta = Table.AddColumn(Tipos, "Maquina", each [ID_Maquina] & " · " & [Nombre], type text)
in
    ConEtiqueta
