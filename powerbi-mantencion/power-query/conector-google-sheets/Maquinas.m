// ============================================================================
// Consulta: Maquinas   (conector nativo de Google Sheets)
// Requiere el parámetro URL_GoogleSheets (ver Bitacora.m).
// Tabla de dimensión: catálogo de equipos del CD.
// ============================================================================
let
    Origen = GoogleSheets.Contents(URL_GoogleSheets),
    Hoja = Origen{[name = "Maquinas", ItemKind = "Sheet"]}[Data],
    Encabezados = Table.PromoteHeaders(Hoja, [PromoteAllScalars = true]),
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
    // Etiqueta amigable para tooltips y tablas
    ConEtiqueta = Table.AddColumn(Tipos, "Maquina", each [ID_Maquina] & " · " & [Nombre], type text)
in
    ConEtiqueta
