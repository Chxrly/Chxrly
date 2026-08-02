// ============================================================================
// Consulta: Bitacora   (método recomendado: conector nativo de Google Sheets)
// ----------------------------------------------------------------------------
// Requisito previo: crear un parámetro de texto llamado  URL_GoogleSheets
//   Inicio > Administrar parámetros > Nuevo parámetro
//   Nombre: URL_GoogleSheets   Tipo: Texto
//   Valor:  la URL completa de tu hoja, ej:
//           https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX/edit
//
// Cómo usar: Inicio > Obtener datos > Consulta en blanco > Editor avanzado >
// pegar todo este código. La primera vez pedirá iniciar sesión con Google
// (credencial de tipo "Cuenta de organización / Google").
//
// Si el paso "Hoja" diera error en tu versión de Power BI, borra los pasos
// Origen y Hoja, usa Obtener datos > Google Sheets, marca la hoja "Bitacora"
// y conserva desde "Encabezados" hacia abajo.
// ============================================================================
let
    Origen = GoogleSheets.Contents(URL_GoogleSheets),
    Hoja = Origen{[name = "Bitacora", ItemKind = "Sheet"]}[Data],
    Encabezados = Table.PromoteHeaders(Hoja, [PromoteAllScalars = true]),
    // Solo las columnas que usa el modelo (ignora columnas extra que agreguen)
    Columnas = Table.SelectColumns(
        Encabezados,
        {"Fecha", "Turno", "Tecnico", "ID_Maquina", "Tipo_Actividad", "Descripcion",
         "Estado_Maquina", "Detencion_Min", "Pendiente", "Observaciones"},
        MissingField.UseNull
    ),
    // Quita filas vacías (Google Sheets devuelve el rango usado completo)
    SinVacias = Table.SelectRows(Columnas, each [Fecha] <> null and [Fecha] <> ""),
    // Vacíos numéricos -> null antes de tipar
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
