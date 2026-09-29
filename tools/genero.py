"""Adaptación de género para los textos de la biblioteca v2.

Los textos fuente usan concordancia femenina para la persona («ser observada», «sentirse atrapada»).
Para el modo Hombre se pasan a masculino SOLO los participios/adjetivos que dependen de un verbo
referido a la persona (ser, sentirse, verse, estar, quedar…), incluidas enumeraciones coordinadas
(«no ser valorada, visible, querida o útil»). Los sustantivos femeninos («una forma agotada») no se tocan.
"""
import re
V = (r"ser|sentirse|se siente|sentirte|siente|sentir|sentirla|estar|está|esté|estaría|quedar|queda|quedarse|"
     r"sea|se vuelve|volverse|parecer|parece|mostrarse|se muestra|verse|se ve|seguir|sigue|siga|resultar|resulta|"
     r"haber sido|sido|fue|termina|terminar|se percibe|percibirse|se considera|considerarse|creerse|se cree|nunca está")
ADV = r"(?:(?:no|poco|muy|demasiado|más|menos|suficientemente|lo suficientemente|tan|nunca|siempre|completamente|totalmente|realmente|bien|mal|también|todavía|aún)\s+){0,3}"
W = r"[a-záéíóúñ]+"
SEQ = re.compile(r"\b(" + V + r")\s+(" + ADV + W + r"(?:(?:,\s+|\s+o\s+|\s+y\s+|\s+ni\s+)" + ADV + W + r")*)")
NOUNS = {"regla", "conducta", "persona", "situación", "respuesta", "necesidad", "forma", "manera", "idea", "meta",
         "sombra", "fuerza", "tarea", "carga", "crítica", "pregunta", "prueba", "pausa", "zona", "vida", "una", "la",
         "esta", "esa", "otra", "cada", "toda", "nada", "para", "contra", "hasta", "fuera", "ella", "misma", "propia",
         "ajena", "clara", "rutina", "puerta", "entrada", "ruta", "figura", "estructura", "experiencia", "decisión",
         "relación", "pareja", "familia", "presencia", "ayuda", "causa", "culpa", "deuda", "lealtad", "identidad",
         "autoridad", "atención", "aprobación", "seguridad", "estabilidad", "capacidad", "energía", "libertad"}
def masc_word(w):
    if w in NOUNS: return w
    for f, m in (("ada", "ado"), ("ida", "ido"), ("adas", "ados"), ("idas", "idos")):
        if w.endswith(f): return w[: -len(f)] + m
    for f, m in (("ta", "to"), ("sa", "so"), ("ca", "co"), ("na", "no"), ("ra", "ro"), ("la", "lo"), ("ja", "jo"), ("ga", "go"), ("da", "do")):
        if w.endswith(f) and len(w) > 4: return w[: -len(f)] + m
    return w
# Adjetivos/participios revisados uno a uno: en los textos v2 siempre se refieren a la persona.
ADJ_OK = {"atrapada", "comparada", "comprendida", "criticada", "cuestionada", "desconectada", "deseada", "detenida",
          "equivocada", "evaluada", "experta", "expuesta", "intensa", "interrumpida", "invadida", "juzgada", "limitada",
          "malinterpretada", "observada", "preparada", "querida", "rechazada", "reconocida", "segura", "sometida",
          "valorada", "vista", "aceptada", "necesaria", "cínica", "sola", "lista", "dogmática", "insuficiente"}
# Frases cuyo sujeto es un sustantivo femenino (conducta, energía, capacidad, visión): se conservan.
KEEP = ["intención sea comprendida", "deja de ser necesaria", "ser observada y corregida", "sentirse segura y auténtica", "ser cultivada", "fue aprendida", "sentirla perfecta"]
ONE = re.compile(r"\b((?:" + V + r")\s+" + ADV + r")(" + W + r")\b")
def masc_word2(w):
    if w not in ADJ_OK: return w
    if w.endswith("ria"): return w[:-1] + "o"
    return masc_word(w)
def masc(s):
    keep = {}
    for i, k in enumerate(KEEP):
        if k in s: s = s.replace(k, f"\x00{i}\x00"); keep[f"\x00{i}\x00"] = k
    for _ in range(3):   # varias pasadas: cadenas encadenadas («ser rechazada o no ser valorada»)
        s = SEQ.sub(lambda m: m.group(1) + " " + re.sub(W, lambda t: masc_word2(t.group(0)), m.group(2)), s)
        s = ONE.sub(lambda m: m.group(1) + masc_word2(m.group(2)), s)
    for ph, k in keep.items(): s = s.replace(ph, k)
    return s
