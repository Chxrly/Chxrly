// Consulta: Fallas  (método CSV por enlace — requiere parámetro ID_Hoja, ver LEEME.md)
let
    Url = "https://docs.google.com/spreadsheets/d/" & ID_Hoja & "/gviz/tq?tqx=out:csv&sheet=Fallas",
    Origen = Csv.Document(Web.Contents(Url), [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true]),
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
    ConFecha = Table.AddColumn(Tipos, "Fecha", each Date.From([Fecha_Hora_Falla]), type date)
in
    ConFecha
