/* =====================================================================
   MATRIX · Generador de informe premium en PDF
   ---------------------------------------------------------------------
   Toma EXCLUSIVAMENTE el resultado del motor (MatrixReading.compute):
   no recalcula ningún valor de la matriz. Su trabajo es interpretar,
   conectar, detectar patrones, sintetizar y redactar.
     build(R, meta)  → secciones editoriales (bloques neutros)
     toPdf(...)      → maquetación vectorial con pdfmake (texto real,
                       fuentes incrustadas; la carta es la única imagen)
   Jerarquía: Centro → patrones repetidos → Cola kármica → programas →
   Amor/Dinero → Talentos → Linajes → Propósitos → Ciclos.
   ===================================================================== */
(function(){
  "use strict";
  const LIB=()=>window.MatrixReading&&window.MatrixReading._lib;

  /* ---------- utilidades de redacción ---------- */
  const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
  const low=s=>s?s.charAt(0).toLowerCase()+s.slice(1):s;
  const nodot=s=>String(s).replace(/\.\s*$/,"");
  const dot=s=>nodot(s)+".";
  const join=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" y "+a[a.length-1];
  const uniq=a=>[...new Set(a)];
  const aMiedo=m=>m.startsWith("el ")?"al "+m.slice(3):"a "+m;
  const AREA={E:"Centro",E1:"Centro",E2:"Centro",D:"Cola kármica",D2:"Cola kármica",D1:"Cola kármica",X2:"Amor",X:"Amor",
    X1:"Dinero",C1:"Dinero",C:"Dinero",C2:"Dinero",B:"Talentos",B1:"Talentos",B2:"Talentos",A:"Imagen y familia",A1:"Imagen y familia",
    A2:"Imagen y familia",A3:"Deseos",B3:"Deseos",F:"Linaje paterno",S1:"Linaje paterno",S2:"Linaje paterno",Y:"Linaje paterno",
    S4:"Linaje paterno",S3:"Linaje paterno",G:"Linaje materno",P1:"Linaje materno",P2:"Linaje materno",K:"Linaje materno",
    P4:"Linaje materno",P3:"Linaje materno"};
  const AREA2={D1:"Amor",X:"Dinero"};
  const areasOf=Ps=>uniq(Ps.flatMap(P=>[AREA[P],AREA2[P]].filter(Boolean)));

  /* =================================================================
     1. CONTENIDO EDITORIAL
     ================================================================= */
  function build(R,meta){
    const {DATA,CORE,ROLE,ZT}=LIB(), p=R.p, pr=R.prop, cy=R.cycle;
    const C=a=>CORE[a], nm=a=>DATA.arc[a].n, rol=P=>ROLE[P].short;
    // Presentar cada Arcano una sola vez; después, solo su función en contexto.
    const seen=new Set();
    const A=a=>{ if(seen.has(a)) return `${nm(a)} (${a})`; seen.add(a); return `${nm(a)} (${a}) —${DATA.arc[a].rec}—`; };
    const axis=t=>(R.axes.find(x=>x.t===t)||{}).txt||"";
    const hheiSeen={};
    function hhei(a,where){
      const c=C(a), k=hheiSeen[a]=(hheiSeen[a]||0)+1, o=k>1?2:0;
      return {t:"hhei",title:where,
        hipo:`${cap(c.cond)}. Suele empezar cuando ${c.trig[(o)%5]}; lo que se evita en el fondo es enfrentarse ${aMiedo(c.miedo)}.`,
        hiper:`Para ${c.necH}, ${c.exc}. El costo: ${c.consH}.`,
        eq:`${cap(c.eq[o%4])}; ${c.eq[(o+1)%4]}.`,
        integ:c.integ};
    }
    const S=[];

    /* ---- 0 · Cómo leer este informe ---- */
    S.push({id:"leer",title:"Cómo leer este informe",blocks:[
      {t:"p",x:"Este informe interpreta tu Matriz del Destino con el método MATRIX. Cada energía se lee según la posición que ocupa, la zona a la que pertenece, las energías con las que se relaciona, las que se repiten y los programas que se activan. No es una lista de definiciones: es el análisis de la matriz completa, organizado por relevancia."},
      {t:"p",x:"La matriz muestra posibilidades de expresión, no tu estado actual. Una misma energía puede vivirse de cuatro maneras:"},
      {t:"kv",items:[["Hipo","la energía se evita, se reprime o se delega: queda por debajo de su potencial."],
        ["Híper","la energía se exagera para compensar una inseguridad: pasa por encima de su potencial."],
        ["Equilibrio","la energía se expresa de forma funcional y observable."],
        ["Integración","el comportamiento funcional se sostiene incluso cuando reaparece el antiguo disparador."]]},
      {t:"p",x:"Nada de lo que sigue predice hechos. Si al leer una descripción concluyes «esto no se manifiesta así en mí», esa conclusión también es información útil: la lectura busca que te reconozcas o que lo descartes con criterio, nunca forzar la identificación. Las narrativas de karma y linaje pertenecen al lenguaje simbólico del método; no se presentan como hechos verificables."},
      {t:"p",x:"El orden sigue la relevancia de cada área: primero tu centro, después los patrones que se repiten, la cola kármica y los programas; luego amor y dinero, talentos, linajes, propósitos y ciclos."}
    ]});

    /* ---- 1 · Tu matriz en una mirada ---- */
    const reps3=R.reps.filter(r=>r.count>=3), progNames=R.programs.map(g=>`${g.code} · ${g.nombre}`);
    const rows=[];
    LIB().GROUPS.forEach(g=>g.pts.forEach(P=>rows.push([P,`${p[P]} · ${nm(p[P])}`,cap(rol(P)),g.t])));
    S.push({id:"mirada",title:"Tu matriz en una mirada",blocks:[
      {t:"img"},
      {t:"table",widths:[150,"*"],head:null,rows:[
        ["Centro (E)",`${p.E} · ${nm(p.E)}`],
        ["Cola kármica (D1 → D2 → D)",`${R.cola.code}${R.cola.col?" · "+R.cola.col.nombre:""}`],
        ["Programas activos",progNames.length?progNames.join("\n"):"Ninguno en orden exacto"],
        ["Energías que más se repiten",reps3.length?reps3.map(r=>`${r.a} · ${r.name} (${r.count} veces)`).join("\n"):"Ninguna aparece tres veces o más"],
        ["Propósitos",`Personal ${pr.personal} · Social ${pr.social} · Espiritual ${pr.espiritual} · Planetario ${pr.planetario}`],
        ["Ciclo actual",`${cy.a} · ${nm(cy.a)} (de ${fmt(cy.from)} a ${fmt(cy.to)} años)`]]},
      {t:"h",x:"Los 32 puntos"},
      {t:"table",small:true,widths:[34,110,"*",120],head:["Punto","Arcano","Función en tu matriz","Zona"],rows}
    ]});

    /* ---- 2 · Cómo funcionas: tu centro ---- */
    const e=C(p.E);
    S.push({id:"centro",title:"Cómo funcionas: tu centro",blocks:[
      {t:"p",x:`Tu centro es **${A(p.E)}**. Es la posición con más peso de la matriz: organiza el tono de todas las demás y es el lugar donde se integran lo que buscas (la línea del Cielo) y lo que haces (la línea de la Tierra). En el centro, ${dot(DATA.dic[p.E].centro)}`},
      {t:"p",x:`Lo que mueve esta energía es la necesidad de ${e.nec}. Lo que más cuesta enfrentar es ${e.miedo}. Cuando esa necesidad se siente amenazada —por ejemplo, cuando ${e.trig[0]} o cuando ${e.trig[1]}— puede ponerse en marcha un ciclo que organiza buena parte de tu manera de funcionar:`},
      {t:"chain",items:e.ciclo},
      {t:"p",x:e.cicloTxt},
      {t:"box",title:"Tu centro según la biblioteca MATRIX",blocks:[{t:"p",x:R.center.cNuc},{t:"kv",items:[["Sombra",R.center.cSom],["Clave estratégica",R.center.cClave]]}]},
      {t:"p",x:R.reads.E.v2[0].interp},
      hhei(p.E,`Tu centro · ${nm(p.E)}`),
      {t:"p",x:`El centro se prolonga en la intimidad. E1 = ${A(p.E1)} describe cómo la vives por dentro, y E2 = ${A(p.E2)}, cómo la expresas. ${axis("Centro y sexualidad")}`},
      {t:"p",x:`${axis("Línea del Cielo (B + D)")} ${axis("Línea de la Tierra (A + C)")} Cuando lo que buscas y lo que haces se desconectan, el primer síntoma suele ser ${e.kern}.`}
    ]});

    /* ---- 3 · Tus patrones principales (3–7) ---- */
    const pats=patternsFor(R,{C,nm,rol,DATA});
    S.push({id:"patrones",title:"Tus patrones principales",blocks:[
      {t:"p",x:`A partir de la matriz completa se detectan ${pats.length} patrones principales. Cada uno está respaldado por puntos concretos: si no te reconoces en alguno, puedes descartarlo.`},
      ...pats.map((x,i)=>({t:"box",title:`${i+1}. ${x.title}`,blocks:[
        {t:"chain",items:x.chain},
        {t:"kv",items:[["Origen en la matriz",x.origen],["Disparador",x.disp],["Respuesta automática",x.resp],["Compensación",x.comp],["Consecuencia",x.cons],["Integración",x.integ]]},
        ...(x.watch?[{t:"p",x:`**Señal de que está activo:** ${low(x.watch)}`}]:[])
      ]}))
    ]});

    /* ---- 4 · Patrones repetidos ---- */
    const repBlocks=[{t:"p",x:"Una energía repetida no es «más positiva» ni «más negativa»: tiene más ocasiones de expresarse, en sus dos extremos. Lo útil es ver qué conducta común une las posiciones y qué recurso puede pasar de un área a otra."}];
    reps3.forEach(r=>repBlocks.push({t:"box",title:`${r.name} (${r.a}) · ${r.count} veces`,blocks:[
      {t:"p",x:`Aparece en ${join(r.pos.map(x=>`${x.P} (${x.rol})`))}, es decir, en ${join(areasOf(r.pos.map(x=>x.P)).map(low))}. ${r.link}`},
      {t:"p",x:`${r.risk} ${r.transfer}`},
      {t:"p",x:`**Según la biblioteca.** ${r.v2rep}`},
      {t:"p",x:`*${cap(DATA.dic[r.a].repeticion)}*`}]}));
    const reps2=R.reps.filter(r=>r.count===2);
    if(reps2.length) repBlocks.push({t:"h",x:"Energías que aparecen dos veces"},{t:"list",items:reps2.map(r=>`**${r.name} (${r.a})** en ${r.pos.map(x=>`${x.P} (${x.rol})`).join(" y ")}: une ${C(r.a).kern}. ${r.transfer}`)});
    if(!R.reps.length) repBlocks.push({t:"p",x:"Ningún Arcano se repite en tus 32 puntos: la energía se reparte entre muchas cualidades distintas."});
    if(R.absent.length){
      repBlocks.push({t:"h",x:"Arcanos ausentes"},
        {t:"p",x:`De los 22 Arcanos, ${R.absent.length===1?"uno no aparece":R.absent.length+" no aparecen"} en ninguno de tus 32 puntos. La ausencia no es una carencia fija: es una cualidad que no llega dada por estructura y que puede entrenarse de forma consciente.`},
        {t:"list",items:R.absent.map(x=>`**${x.name} (${x.a}).** ${x.txt}`)});
    } else repBlocks.push({t:"h",x:"Arcanos ausentes"},{t:"p",x:"Los 22 Arcanos aparecen al menos una vez en tus 32 puntos."});
    S.push({id:"repeticiones",title:"Patrones repetidos y ausentes",blocks:repBlocks});

    /* ---- 5 · Cola kármica ---- */
    const k=R.cola, [d1,d2,d]=k.vals, c1=C(d1),c2=C(d2),c3=C(d);
    const colName=k.col?k.col.nombre:"Secuencia fuera del catálogo canónico";
    S.push({id:"cola",title:`Tu Cola kármica: ${colName}`,blocks:[
      {t:"p",x:`**${k.code}${k.col?" · "+k.col.nombre:""}.** Dentro del lenguaje simbólico de esta metodología, la Cola kármica describe un aprendizaje que se lee en orden: D1 es la entrada u origen simbólico, D2 la respuesta aprendida y D el aprendizaje central. No se presenta como un hecho sobre vidas pasadas, sino como un patrón que puedes observar hoy.`},
      ...(k.col?[{t:"kv",items:[["Significado",`«${k.col.nombre}» oscila entre ${low(nodot(k.col.rec))} y su sombra: ${low(nodot(k.col.sombra))}.`]]}]:[{t:"p",x:`La combinación ${k.code} no pertenece al catálogo canónico de 26 colas, así que no se le asigna nombre; la secuencia se lee con la misma lógica.`}]),
      {t:"kv",items:[
        ["D1 · entrada / origen",`${A(d1)}. Se activa primero y antes de pensar: ${c1.kern}. Como D1 también pertenece al Canal del Amor, este patrón suele hacerse visible primero en los vínculos.`],
        ["D2 · respuesta aprendida",`${A(d2)}. La estrategia con que el patrón se sostiene: ${c2.hipoC}, o en su versión compensada, ${c2.hiperC}.`],
        ["D · aprendizaje central",`${A(d)}. Lo que busca integrarse es la capacidad de ${low(nodot(DATA.arc[d].clave))}.`]]},
      {t:"h",x:"Cómo se repite"},
      {t:"chain",items:[`Se activa ${c1.kern}`,cap(c2.hipoC),cap(c3.hipoC),"La entrada se refuerza"]},
      {t:"kv",items:k.chain.map(([t,x],i)=>[["Disparador","Respuesta","Consecuencia","Repetición"][i],x])},
      {t:"kv",items:[
        ["Potencial positivo",k.col?k.col.rec:dot(cap(DATA.arc[d].rec))],
        ["Manifestación negativa",k.col?k.col.sombra:`${cap(c3.hipoC)}; o ${c3.hiperC}.`],
        ["Hipo",k.hipo],["Híper",k.hiper],
        ["Qué necesita trabajarse",`La estrategia de D2 es el punto donde el ciclo puede interrumpirse. ${c2.acc.replace("{amb}",ZT.cola.amb)}`],
        ["Equilibrio",k.eq],["Prueba de integración",k.integ]]},
      {t:"p",x:"*Narrativa simbólica del método: no afirma vidas pasadas ni describe hechos verificables.*"}
    ]});

    /* ---- 6 · Programas activos ---- */
    const progBlocks=R.programs.length?[{t:"p",x:"Un programa es una combinación documentada de energías que aparece en orden exacto dentro de una zona. El mismo programa conserva su núcleo, pero cambia según la zona y según qué Arcano ocupa el punto eje (la raíz de la zona)."}]
      :[{t:"p",x:"No se detectan programas documentados en el orden exacto de ninguna zona. No se inventan combinaciones: la lectura se apoya en el centro, las repeticiones, la cola y los ejes."}];
    R.programs.forEach(g=>progBlocks.push({t:"box",title:`${g.code} · ${g.nombre}`,blocks:[{t:"kv",items:[
      ["Qué significa",g.nucleo],
      ["Dónde aparece",`${g.zona}: ${g.dist.map(x=>`${x.P} = ${nm(x.a)} (${x.a}, ${x.rol})`).join(" → ")}.`],
      ["Cómo cambia por esta zona",`${g.contexto} ${g.enfasis}`],
      ...(g.fuenteZona?[["Lectura documentada para esta zona",g.fuenteZona]]:[]),
      ["Potencial positivo",g.potencial],["Qué puede volverse negativo",g.sombra],
      ["Disparadores",`${cap(join(g.trig))}.`],
      ["Hipo",g.hipo],["Híper",g.hiper],
      ["Ciclo de repetición",`${g.chain.join(" → ")}. ${g.ciclo}`],
      ["Costo del patrón",g.costo],["Qué trabajar",`${g.tarea} ${g.acc}`],
      ["Equilibrio",`${cap(g.eq[0])}; ${g.eq[1]}.`],["Integración",g.integ],
      ["Señales de alerta",`${cap(join(g.alertas))}.`],["Señales de progreso",`${cap(join(g.progreso))}.`]]}]}));
    S.push({id:"programas",title:"Programas activos",blocks:progBlocks});

    /* ---- 7 · Amor y dinero ---- */
    S.push({id:"amordinero",title:"Amor y dinero",blocks:[
      {t:"h",x:"Cómo te vinculas"},
      {t:"p",x:`Tu forma de vincularte se lee en tres puntos. La puerta es D1 = ${A(p.D1)}, que en el amor ${low(dot(DATA.dic[p.D1].amor))} Lo que favorece tu crecimiento en pareja está en X2 = ${A(p.X2)}: ${low(dot(DATA.dic[p.X2].amor))} El equilibrio entre afecto, trabajo y recursos se juega en X = ${A(p.X)}: ${low(dot(DATA.dic[p.X].amor))}`},
      {t:"p",x:axis("Amor ↔ Dinero (X = D1 + C1)")},
      hhei(p.X2,`En la pareja · ${nm(p.X2)} en X2`),
      {t:"h",x:"Tu relación con el trabajo y los recursos"},
      {t:"p",x:`La lección material inicial está en C = ${A(p.C)}: ${low(dot(DATA.dic[p.C].dinero))} La conducta que puede agravarla o detonarla está en C2 = ${A(p.C2)}, y la vía de abundancia, en C1 = ${A(p.C1)}: ${low(dot(DATA.dic[p.C1].dinero))} El trabajo que favorece tu flujo económico se describe en X1 = ${A(p.X1)}: ${low(dot(DATA.dic[p.X1].dinero))}`},
      {t:"p",x:`${axis("Karma material")} ${axis("Canal del Dinero")}`},
      hhei(p.C2,`La conducta que detona tu lección material · ${nm(p.C2)} en C2`)
    ]});

    /* ---- 8 · Talentos ---- */
    S.push({id:"talentos",title:"Talentos",blocks:[
      {t:"p",x:`Tu talento principal está en B = ${A(p.B)}: ${low(dot(DATA.dic[p.B].talentos))} B1 = ${A(p.B1)} es un talento mental ya disponible —${low(nodot(DATA.dic[p.B1].talentos))}—, y B2 = ${A(p.B2)} señala la autoexpresión que todavía necesita práctica: ${low(dot(DATA.dic[p.B2].talentos))}`},
      {t:"p",x:axis("Talentos")},
      {t:"p",x:`**Lo que puedes estar subutilizando.** Un talento disponible se pierde sobre todo por Hipo: en B1, cuando ${C(p.B1).hipoC}; en B, cuando ${C(p.B).hipoC}. Usado con conciencia, ${C(p.B1).obj} puede ayudarte justo donde más te cuesta —por ejemplo, en C2, la conducta que detona tu lección material.`},
      hhei(p.B,`Tu talento principal · ${nm(p.B)} en B`)
    ]});

    /* ---- 9 · Linajes ---- */
    S.push({id:"linajes",title:"Linajes",blocks:[
      {t:"p",x:"En el lenguaje simbólico del método, la línea paterna se relaciona más con autoridad, límites, lógica y acción, y la materna con emociones, intuición, vínculos y receptividad. En cada línea hay dones heredados y patrones heredados; el recurso aparece al revisar la herencia, no al rechazarla."},
      {t:"h",x:"Línea paterna"},
      {t:"p",x:`La raíz de los dones paternos es F = ${A(p.F)}: ${low(dot(DATA.dic[p.F].linPat))} El talento heredado está en S1 = ${A(p.S1)} y la respuesta adaptativa, en S2 = ${A(p.S2)}. La raíz de los patrones paternos es Y = ${A(p.Y)}; el mandato que puede mantenerlos activo está en S4 = ${A(p.S4)}, y la maestría que se libera al revisarlo, en S3 = ${A(p.S3)}.`},
      {t:"p",x:`${axis("Linaje paterno — dones")} ${axis("Linaje paterno — patrones")}`},
      hhei(p.S4,`El mandato paterno · ${nm(p.S4)} en S4`),
      {t:"h",x:"Línea materna"},
      {t:"p",x:`La raíz de los dones maternos es G = ${A(p.G)}: ${low(dot(DATA.dic[p.G].linMat))} El talento heredado está en P1 = ${A(p.P1)} y la reacción que lo lleva a la práctica, en P2 = ${A(p.P2)}. La raíz de los patrones maternos es K = ${A(p.K)}; el nudo o la lealtad no resuelta está en P4 = ${A(p.P4)}, y el recurso que se libera, en P3 = ${A(p.P3)}.`},
      {t:"p",x:`${axis("Linaje materno — dones")} ${axis("Linaje materno — patrones")}`},
      hhei(p.P4,`El nudo materno · ${nm(p.P4)} en P4`)
    ]});

    /* ---- 10 · Imagen, familia y deseos ---- */
    S.push({id:"imagen",title:"Imagen, familia y deseos",blocks:[
      {t:"p",x:`Lo que los demás perciben antes de conocerte está en A = ${A(p.A)}: ${low(dot(DATA.dic[p.A].retrato))} En el vínculo entre padres e hijos, A1 = ${A(p.A1)} muestra lo que necesita equilibrarse y A2 = ${A(p.A2)}, el error de trato que conviene no repetir.`},
      {t:"p",x:axis("Retrato y padres-hijos")},
      {t:"p",x:`En los deseos, A3 = ${A(p.A3)} describe lo que tu cuerpo, tu vida material y tus logros buscan vivir, y B3 = ${A(p.B3)}, el anhelo que busca sentido más allá de lo material. Cuando un deseo se niega durante mucho tiempo, suele reaparecer como insatisfacción difusa; cuando se persigue con urgencia, nunca parece suficiente.`}
    ]});

    /* ---- 11 · Propósitos ---- */
    const prp=[["Personal","entre los 20 y los 40 años",pr.personal],["Social","entre los 40 y los 60 años",pr.social],["Espiritual","a lo largo de toda la vida",pr.espiritual],["Planetario","como contribución más amplia",pr.planetario]];
    S.push({id:"propositos",title:"Propósitos",blocks:[
      {t:"p",x:`Los propósitos no son metas externas: describen qué aprendizaje cobra protagonismo en cada etapa. Se construyen uno sobre otro: el personal nace de la línea del Cielo (${pr.cielo} · ${nm(pr.cielo)}) y de la Tierra (${pr.tierra} · ${nm(pr.tierra)}); el social, de las líneas masculina (${pr.masc}) y femenina (${pr.fem}).`},
      {t:"kv",items:prp.map(([t,cuando,a])=>[`Propósito ${t.toLowerCase()} · ${a} ${nm(a)}`,`Suele pedir atención ${cuando}. ${cap(dot(DATA.dic[a].proposito))}`])},
      {t:"p",x:`Sin integrar ${C(pr.personal).obj}, el propósito social tiende a vivirse desde ${C(pr.social).kern}.`}
    ]});

    /* ---- 12 · Ciclos ---- */
    S.push({id:"ciclos",title:"Ciclos",blocks:[
      {t:"p",x:`La línea de la vida recorre el perímetro de la matriz en tramos de 1,25 años. Con ${fmt(cy.age,1)} años, el tramo actual (de ${fmt(cy.from)} a ${fmt(cy.to)} años) lleva la energía de ${A(cy.a)}. ${cy.txt}`},
      {t:"table",widths:[140,"*"],head:["Tramo (edad)","Energía"],rows:cy.upcoming.map(u=>[`${fmt(u.from)} – ${fmt(u.to)}`,`${u.a} · ${nm(u.a)}`])},
      {t:"p",x:"*Los ciclos no predicen hechos: señalan el tema que puede pedir más atención en cada período.*"}
    ]});

    /* ---- 13 · Cierre ---- */
    const res=resources(R,{C,nm,rol,DATA});
    const plan=planFor(R,pats,{C,ZT});
    const preg=questionsFor(R,pats,{C,nm,ROLE});
    S.push({id:"cierre",title:"Tu síntesis",blocks:[
      {t:"h",x:"Tus patrones centrales"},
      {t:"list",items:pats.map(x=>`**${x.title}.** ${cap(x.short)}`)},
      {t:"h",x:"Tus principales recursos"},
      {t:"list",items:res},
      {t:"h",x:"Lo que más te conviene observar"},
      {t:"list",items:observe(R,pats,{C,nm})},
      {t:"h",x:"Plan de integración"},
      {t:"list",ordered:true,items:plan},
      {t:"h",x:"Preguntas para los próximos meses"},
      {t:"list",items:preg},
      {t:"h",x:"En nueve respuestas"},
      {t:"kv",items:nine(R,pats,res,{C,nm,rol})},
      {t:"p",x:"*Herramienta simbólica de autoconocimiento. No sustituye consejo médico, psicológico, legal ni financiero, no describe hechos y no predice acontecimientos.*"}
    ]});

    /* ---- Anexo · los 32 puntos con la biblioteca v2 ---- */
    const anexo=[{t:"p",x:"Cada punto se lee como Arcano × posición × zona, con la biblioteca de 770 interpretaciones MATRIX. D1, X y C1 participan en dos zonas y se leen en ambas."}];
    LIB().GROUPS.forEach(g=>g.pts.forEach(P=>{
      const r=R.reads[P];
      anexo.push({t:"box",title:`${P} · ${r.name} (${r.a}) — ${r.v2[0].posf}`,blocks:r.v2.flatMap((v,i)=>[
        ...(i?[{t:"p",x:`**También en ${v.zona} · ${v.posf}.**`}]:[]),
        {t:"p",x:v.interp},
        {t:"kv",items:[["Pregunta clave",v.preg],["Prueba de integración",v.integ]]}])});
    }));
    S.push({id:"anexo",title:"Anexo · Tus 32 puntos en detalle",blocks:anexo});
    return S;
  }
  const fmt=(x,d)=>(d?x.toFixed(d):(Math.round(x*100)/100).toString()).replace(".",",");

  /* ---------- patrones principales (3–7) ---------- */
  function patternsFor(R,{C,nm,rol,DATA}){
    const p=R.p, out=[];
    const evTxt=ev=>join(ev.map(e=>`${e.P} = ${nm(e.a)} (${e.a}, ${rol(e.P)})`));
    // a) patrones globales respaldados por la matriz
    R.patternsAll.slice(0,4).forEach(x=>{
      const ev=[...x.ev].sort((a,b)=>b.w-a.w);
      const h=ev.find(e=>e.pole!=="hiper"), k=ev.find(e=>e.pole!=="hipo"&&(!h||e.a!==h.a))||ev.find(e=>e.pole!=="hipo")||ev[0];
      const src=h||k, areas=areasOf(ev.map(e=>e.P));
      out.push({score:x.score,title:x.pt.t,chain:x.pt.chain,watch:x.pt.watch,
        short:`${x.pt.chain[0]} → ${x.pt.chain[x.pt.chain.length-1]}; lo respaldan ${ev.map(e=>e.P).join(", ")}.`,
        origen:`Lo respaldan ${evTxt(ev)}.${areas.length>=3?` Atraviesa ${join(areas.map(low))}: es un patrón transversal, no un rasgo aislado.`:""}`,
        disp:`Puede activarse cuando ${C(src.a).trig[0]}${k&&k.a!==src.a?`, o cuando ${C(k.a).trig[1]}`:""}.`,
        resp:`${cap(x.pt.chain[1])}. En tu matriz se ve sobre todo en ${src.P} (${nm(src.a)}): ${h?C(src.a).cond:C(src.a).exc}.`,
        comp:`Para ${C(k.a).necH}, ${C(k.a).exc}.`,
        cons:`${cap(C(k.a).consH)}; y el ciclo vuelve a empezar: ${x.pt.chain[x.pt.chain.length-1]}.`,
        integ:`${x.pt.move} ${C(src.a).integ}`});
    });
    // b) Cola kármica como patrón
    const k=R.cola,[d1,d2,d]=k.vals;
    out.push({score:5.5,title:`El patrón de tu Cola kármica · ${k.col?k.col.nombre:"secuencia "+k.code} (${k.code})`,
      chain:[`se activa ${C(d1).kern}`,C(d2).hipoC,C(d).hipoC,"la entrada se refuerza"],
      short:`${C(d1).kern} → ${C(d2).hipoC} → ${C(d).hipoC}.`,
      origen:`D1 = ${nm(d1)} (${d1}) como entrada, D2 = ${nm(d2)} (${d2}) como respuesta aprendida y D = ${nm(d)} (${d}) como aprendizaje central. Como D1 también pertenece al Canal del Amor, suele verse primero en los vínculos.`,
      disp:`${cap(C(d1).trig[0])}.`, resp:`${cap(C(d2).cond)}.`, comp:`Para ${C(d2).necH}, ${C(d2).exc}.`,
      cons:`${cap(C(d).cons)}.`, integ:k.integ});
    // c) patrones transversales: una misma energía en muchas áreas
    R.reps.map(r=>({r,areas:areasOf(r.pos.map(x=>x.P))})).filter(o=>o.r.count>=3||o.areas.length>=3)
      .sort((a,b)=>b.r.count-a.r.count||b.areas.length-a.areas.length).slice(0,2).forEach(({r,areas})=>{
        const c=C(r.a);
        out.push({score:r.count*1.2+areas.length*.5,title:`Patrón transversal · ${cap(c.kern)}`,chain:c.ciclo,
          short:`${nm(r.a)} (${r.a}) en ${join(areas.map(low))}.`,
          origen:`${nm(r.a)} (${r.a}) aparece ${r.count} veces —${join(r.pos.map(x=>`${x.P}, ${x.rol}`))}— y atraviesa ${join(areas.map(low))}. Cuando un mismo tema aparece en áreas tan distintas, no se trata de un rasgo aislado sino de un patrón transversal.`,
          disp:`${cap(c.trig[0])}; también cuando ${c.trig[2]}.`, resp:`${cap(c.cond)}.`, comp:`Para ${c.necH}, ${c.exc}.`,
          cons:`${cap(c.cons)}; o, en el otro extremo, ${c.consH}.`, integ:`${c.integ} ${r.transfer}`});
      });
    // d) si faltan, el ciclo del centro
    if(out.length<3){ const c=C(p.E); out.push({score:1,title:`El ciclo de tu centro · ${nm(p.E)}`,chain:c.ciclo,short:c.ciclo.join(" → ")+".",
      origen:`Tu centro, E = ${nm(p.E)} (${p.E}), organiza el tono de toda la matriz.`,disp:`${cap(c.trig[0])}.`,resp:`${cap(c.cond)}.`,
      comp:`Para ${c.necH}, ${c.exc}.`,cons:`${cap(c.cons)}.`,integ:c.integ}); }
    return out.sort((a,b)=>b.score-a.score).slice(0,7);
  }
  function resources(R,{C,nm,rol,DATA}){
    const p=R.p;
    return ["E","B","B1","C1","X1","S3","P3"].map(P=>`**${cap(rol(P))} (${P} · ${nm(p[P])}):** ${DATA.arc[p[P]].rec}. En equilibrio: ${C(p[P]).eq[0]}.`);
  }
  function observe(R,pats,{C,nm}){
    const p=R.p, out=[];
    pats.slice(0,3).forEach(x=>out.push(`**${x.title}.** ${x.watch?cap(x.watch):"Observa en qué áreas aparece a la vez."}`));
    const top=R.reps.find(r=>r.count>=3);
    if(top) out.push(`**${nm(top.a)} en ${top.pos.map(x=>x.P).join(", ")}.** Una energía repetida en tantas posiciones tiene más ocasiones de irse a sus extremos: ${C(top.a).hipoC} o ${C(top.a).hiperC}.`);
    out.push(`**La estrategia de D2 (${nm(p.D2)}).** Es el punto donde tu cola kármica puede interrumpirse: ${C(p.D2).hipoC}, o ${C(p.D2).hiperC}.`);
    return out;
  }
  function planFor(R,pats,{C,ZT}){
    const p=R.p, used=new Set(), out=[];
    const add=(a,zt)=>{ if(used.has(a)||out.length>=9) return; used.add(a); out.push(C(a).acc.replace("{amb}",ZT[zt].amb)); };
    add(p.E,"centro"); add(p.D2,"cola");
    R.programs.slice(0,2).forEach(g=>{ if(!used.has(g.ea)){ used.add(g.ea); out.push(g.acc); } });
    add(p.X2,"amor"); add(p.C2,"material"); add(p.B2,"talentos"); add(p.S4,"linPat"); add(p.P4,"linMat"); add(p.X1,"dinero");
    if(pats[0]&&pats[0].integ) out.splice(1,0,`Frente a «${pats[0].title}»: ${low(pats[0].integ.split(". ")[0])}.`);
    return out.slice(0,10);
  }
  function questionsFor(R,pats,{C,nm,ROLE}){
    const p=R.p, cy=R.cycle;
    return uniq([C(p.E).preg[0],C(p.D2).preg[0],
      ...pats.slice(0,2).map(x=>`¿En qué situación reciente reconocí «${x.title.replace(/^Patrón transversal · /,"")}», y qué hice justo antes?`),
      C(p.X2).preg[1],ROLE.B2.preg,ROLE.S4.preg,ROLE.P4.preg,
      `En este tramo de ${nm(cy.a)}, ¿qué tema de mi vida está pidiendo más atención?`]).slice(0,9);
  }
  function nine(R,pats,res,{C,nm,rol}){
    const p=R.p, e=C(p.E), top=R.reps.find(r=>r.count>=3)||R.reps[0];
    return [
      ["¿Cómo funciono?",`Desde tu centro, ${nm(p.E)}: necesitas ${e.nec}, y te cuesta enfrentar ${e.miedo}.`],
      ["¿Qué patrones repito?",`${join(pats.slice(0,4).map(x=>`«${x.title}»`))}.`],
      ["¿Qué los activa?",`Sobre todo situaciones en que ${e.trig[0]}, en que ${C(p.D1).trig[0]}, o en que ${C(p.D2).trig[1]}.`],
      ["¿Cómo los compenso?",`Para ${e.necH}, ${e.exc}.${pats[0]?" "+pats[0].comp:""}`],
      ["¿Qué capacidades tengo?",`${nm(p.B)} como talento principal, ${nm(p.B1)} como talento mental disponible, ${nm(p.C1)} como vía de abundancia y ${nm(p.S3)} y ${nm(p.P3)} como recursos que se liberan al revisar tus linajes.`],
      ["¿Qué estoy subutilizando?",`Puede quedar sin usar ${C(p.B1).obj} (B1) cuando ${C(p.B1).hipoC}, y ${C(p.C1).obj} (C1) cuando ${C(p.C1).hipoC}.`],
      ["¿Qué estoy sobreactivando?",top?`Con ${nm(top.a)} repetido ${top.count} veces, el exceso más probable es este: ${C(top.a).hiperC}. En tu centro: ${e.hiperC}.`:`En tu centro: ${e.hiperC}.`],
      ["¿Qué necesito trabajar?",`La estrategia aprendida de D2 (${nm(p.D2)}) y ${pats[0]?"el patrón «"+pats[0].title+"»":"el ciclo de tu centro"}: ${low(nodot(C(p.D2).integ.split(": ").pop()))}.`],
      ["¿Cómo sé que estoy avanzando?",`${cap(e.prog[0])}; ${C(p.D2).prog[0]}; ${C(p.X2).prog[1]}.`]
    ];
  }

  /* =================================================================
     2. CARTA → imagen (única imagen del informe)
     ================================================================= */
  // La carta celeste tal como se ve en pantalla: variables CSS resueltas, estilos de texto y numerales
  // Garamond incrustados en el SVG (una imagen SVG no puede leer el CSS ni las fuentes de la página).
  const CHART_CSS=`.num{font-family:NG,serif;font-weight:700;paint-order:stroke;stroke:rgba(10,8,24,.55);stroke-width:1.6px}.num-dark{stroke:none}
    .pv{font-family:NG,serif;font-weight:700;fill:var(--ch-text);paint-order:stroke;stroke:var(--ch-bg);stroke-width:3px}.pv-mid{fill:#ffe3a6}
    .pa{fill:var(--ch-muted);font-family:Helvetica,Arial,sans-serif;paint-order:stroke;stroke:var(--ch-bg);stroke-width:2px}
    .va{fill:var(--ch-gold);font-family:Helvetica,Arial,sans-serif;font-size:9.5px;font-weight:800}
    .ch-lbl{fill:var(--ch-gold);font-family:Helvetica,Arial,sans-serif;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase}
    .ch-line{font-family:NG,serif;font-style:italic;font-size:10.5px}.orb-glow{opacity:.55}`;
  function chartImage(){
    return new Promise(res=>{
      const svg=document.getElementById("matrix"), card=document.querySelector(".chart-card"); if(!svg||!card) return res(null);
      const cs=getComputedStyle(card), cv=v=>(cs.getPropertyValue(v)||"").trim()||"#888";
      const cl=svg.cloneNode(true);
      cl.querySelectorAll("*").forEach(el=>{["stroke-dasharray","stroke-dashoffset","opacity","visibility","transform","translate","rotate","scale"]
        .forEach(pr=>el.style&&el.style.removeProperty(pr)); if(el.getAttribute("style")==="") el.removeAttribute("style");});
      cl.querySelectorAll(".ch-sky circle").forEach(c=>c.removeAttribute("style"));
      cl.removeAttribute("style"); cl.setAttribute("xmlns","http://www.w3.org/2000/svg");
      const vb=svg.viewBox.baseVal, W=1400, H=Math.round(W*vb.height/vb.width); cl.setAttribute("width",W); cl.setAttribute("height",H);
      const font=window.pdfMake&&window.pdfMake.vfs&&window.pdfMake.vfs["EBGaramond-SemiBold.ttf"];
      const st=document.createElementNS("http://www.w3.org/2000/svg","style");
      st.textContent=(font?`@font-face{font-family:NG;src:url(data:font/ttf;base64,${font}) format("truetype");font-weight:700}`:"")+CHART_CSS;
      cl.insertBefore(st,cl.firstChild);
      const src=new XMLSerializer().serializeToString(cl).replace(/var\((--[\w-]+)\)/g,(m,v)=>cv(v));
      const img=new Image();
      img.onload=()=>{const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
        const gr=g.createRadialGradient(W/2,H*.45,0,W/2,H*.45,W*.75); gr.addColorStop(0,cv("--ch-bg2")); gr.addColorStop(.62,cv("--ch-bg")); gr.addColorStop(1,"#07060f");
        g.fillStyle=gr; g.fillRect(0,0,W,H); g.drawImage(img,0,0,W,H); res(c.toDataURL("image/jpeg",.9));};
      img.onerror=()=>res(null);
      img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(src);
    });
  }

  /* =================================================================
     3. MAQUETACIÓN PDF (pdfmake · EB Garamond)
     ================================================================= */
  const K={ink:"#241c33",soft:"#443a5c",muted:"#6a6280",gold:"#8a5f28",goldL:"#a9793a",paper:"#fbf7ef",parch:"#efe9dd",line:"#e2d7c2",
    hipo:"#2d56ad",hiper:"#b0392b",hipoBg:"#eef2fb",hiperBg:"#fbefec",eqBg:"#f6f0e2",integBg:"#f0ecf6",integ:"#4b3b7a",eq:"#8a5f28"};
  function rich(s){
    const out=[]; String(s).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).forEach(t=>{ if(!t) return;
      if(t.startsWith("**")) out.push({text:t.slice(2,-2),bold:true}); else if(t.startsWith("*")) out.push({text:t.slice(1,-1),italics:true,color:K.muted}); else out.push(t);});
    return out;
  }
  function blocksToPdf(blocks,img){
    const out=[];
    blocks.forEach(b=>{
      if(b.t==="p") out.push({text:rich(b.x),margin:[0,0,0,8]});
      else if(b.t==="h") out.push({text:b.x,style:"h2"});
      else if(b.t==="kv") b.items.forEach(([k,v])=>out.push({stack:[{text:k.toUpperCase(),style:"lbl"},{text:rich(v)}],margin:[0,0,0,7],unbreakable:v.length<420}));
      else if(b.t==="list") out.push({[b.ordered?"ol":"ul"]:b.items.map(x=>({text:rich(x),margin:[0,0,0,5]})),margin:[4,0,0,8],markerColor:K.gold});
      else if(b.t==="chain") out.push({table:{widths:["*"],body:[[{text:b.items.map((x,i)=>[{text:cap(x)},i<b.items.length-1?{text:"  →  ",color:K.gold,bold:true}:{text:"  (vuelve a empezar)",color:K.muted,italics:true}]).flat(),fontSize:10,color:K.soft}]]},
        layout:{fillColor:()=>K.paper,hLineColor:()=>K.line,vLineColor:()=>K.line,paddingLeft:()=>10,paddingRight:()=>10,paddingTop:()=>7,paddingBottom:()=>7},margin:[0,2,0,10]});
      else if(b.t==="hhei") out.push({stack:[{text:b.title,style:"h3"},{table:{widths:["*","*"],body:[
          [cell("Hipo · qué evita o reprime",b.hipo,K.hipo,K.hipoBg),cell("Híper · qué exagera para compensar",b.hiper,K.hiper,K.hiperBg)],
          [cell("Equilibrio · cómo se ve funcionando",b.eq,K.eq,K.eqBg),cell("Integración · bajo el antiguo disparador",b.integ,K.integ,K.integBg)]]},
        layout:{hLineColor:()=>"#ffffff",vLineColor:()=>"#ffffff",hLineWidth:()=>3,vLineWidth:()=>3,paddingLeft:()=>9,paddingRight:()=>9,paddingTop:()=>8,paddingBottom:()=>8}}],margin:[0,4,0,12],unbreakable:true});
      else if(b.t==="box") out.push({table:{widths:["*"],body:[[{stack:[{text:b.title,style:"boxT"},...blocksToPdf(b.blocks,img)]}]],dontBreakRows:false},
        layout:{fillColor:()=>"#fdfbf6",hLineColor:()=>K.line,vLineColor:()=>K.line,paddingLeft:()=>14,paddingRight:()=>14,paddingTop:()=>12,paddingBottom:()=>6},margin:[0,4,0,14]});
      else if(b.t==="table"){
        const body=[]; if(b.head) body.push(b.head.map(h=>({text:h.toUpperCase(),style:"th"})));
        b.rows.forEach(r=>body.push(r.map((c,i)=>({text:String(c),fontSize:b.small?9:10.5,bold:!b.head&&i===0,color:!b.head&&i===0?K.soft:K.ink}))));
        out.push({table:{headerRows:b.head?1:0,widths:b.widths,body},layout:{hLineColor:()=>K.line,vLineWidth:()=>0,hLineWidth:(i)=>i===0?0:.6,paddingTop:()=>4,paddingBottom:()=>4,
          fillColor:(i)=>b.head&&i===0?K.paper:null},margin:[0,2,0,12]});
      }
      else if(b.t==="img"&&img) out.push({image:img,width:400,alignment:"center",margin:[0,0,0,14]});
    });
    return out;
    function cell(t,x,col,bg){return {stack:[{text:t.toUpperCase(),fontSize:7.5,bold:true,color:col,characterSpacing:.8,margin:[0,0,0,3]},{text:x,fontSize:10,lineHeight:1.28}],fillColor:bg};}
  }
  function octagram(cx,cy,r,color){
    const pts=(rot)=>[0,1,2,3,4].map(i=>{const a=(i*90+rot)*Math.PI/180;return {x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};});
    return [{type:"ellipse",x:cx,y:cy,r1:r*1.18,r2:r*1.18,lineColor:color,lineWidth:.8},
      {type:"polyline",points:pts(45),lineColor:color,lineWidth:1.2},{type:"polyline",points:pts(0),lineColor:color,lineWidth:1.2},
      {type:"ellipse",x:cx,y:cy,r1:r*.62,r2:r*.62,lineColor:color,lineWidth:.6}];
  }
  function toPdf(sections,meta,img){
    const who=meta.name?meta.name:`Nacimiento ${meta.birth}`;
    const content=[];
    // Portada
    content.push({canvas:octagram(233,120,62,K.goldL),margin:[0,40,0,0]},
      {text:"NUMEN · MATRIX",alignment:"center",fontSize:10,characterSpacing:4,color:K.gold,bold:true,margin:[0,40,0,10]},
      {text:"Tu Matriz del Destino",alignment:"center",fontSize:34,color:K.ink,bold:true,margin:[0,0,0,6]},
      {text:"Informe personalizado de interpretación profunda",alignment:"center",fontSize:14,italics:true,color:K.soft,margin:[0,0,0,34]},
      ...(meta.name?[{text:meta.name,alignment:"center",fontSize:20,color:K.ink,margin:[0,0,0,4]}]:[]),
      {text:`Fecha de nacimiento: ${meta.birth}`,alignment:"center",fontSize:12,color:K.soft},
      {text:`Arcano central: ${meta.center}`,alignment:"center",fontSize:12,color:K.soft,margin:[0,2,0,0]},
      {text:`Emitido el ${meta.issued}`,alignment:"center",fontSize:10,color:K.muted,margin:[0,2,0,0]},
      {text:"Herramienta simbólica de autoconocimiento: describe posibilidades de expresión, no hechos ni predicciones.",alignment:"center",fontSize:9,italics:true,color:K.muted,margin:[60,120,60,0],pageBreak:"after"});
    content.push({toc:{title:{text:"Contenido",style:"h1"},numberStyle:{color:K.muted},textStyle:{color:K.ink}},pageBreak:"after"});
    sections.forEach((s,i)=>{
      content.push({text:String(i).padStart(2,"0"),style:"eyebrow",pageBreak:i===0?undefined:"before"},
        {text:s.title,style:"h1",tocItem:true,tocStyle:{fontSize:11.5},tocMargin:[0,3,0,0]},
        {canvas:[{type:"line",x1:0,y1:0,x2:60,y2:0,lineWidth:1.2,lineColor:K.goldL}],margin:[0,2,0,14]},
        ...blocksToPdf(s.blocks,img));
    });
    return {
      pageSize:"A4",pageMargins:[62,70,62,64],
      info:{title:`Informe MATRIX — ${who}`,author:"Numen · MATRIX",subject:"Matriz del Destino · interpretación profunda",creator:"Numen"},
      defaultStyle:{font:"Garamond",fontSize:11,lineHeight:1.3,color:K.ink},
      styles:{h1:{fontSize:24,bold:true,color:K.ink,margin:[0,0,0,4]},h2:{fontSize:14.5,bold:true,color:K.ink,margin:[0,10,0,5]},
        h3:{fontSize:12,bold:true,italics:true,color:K.soft,margin:[0,0,0,5]},eyebrow:{fontSize:10,color:K.gold,bold:true,characterSpacing:3},
        lbl:{fontSize:7.8,bold:true,color:K.gold,characterSpacing:1,margin:[0,0,0,1]},boxT:{fontSize:13.5,bold:true,color:K.ink,margin:[0,0,0,6]},
        th:{fontSize:7.5,bold:true,color:K.gold,characterSpacing:1}},
      background:(page)=>page===1?{canvas:[{type:"rect",x:0,y:0,w:595.28,h:841.89,color:K.parch}]}:null,
      header:(page)=>page<=2?null:{columns:[{text:"NUMEN · INFORME MATRIX",fontSize:7.5,characterSpacing:2,color:K.muted},{text:who,fontSize:8.5,italics:true,color:K.muted,alignment:"right"}],margin:[62,32,62,0]},
      footer:(page,count)=>page===1?null:{text:`${page} / ${count}`,alignment:"center",fontSize:8.5,color:K.muted,margin:[0,26,0,0]},
      content};
  }

  /* =================================================================
     4. CARGA DIFERIDA Y DESCARGA
     ================================================================= */
  let libs=null;
  function loadScript(src){return new Promise((ok,ko)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>ko(new Error("No se pudo cargar "+src));document.head.appendChild(s);});}
  async function b64(url){const r=await fetch(url);if(!r.ok) throw new Error("No se pudo cargar "+url);const buf=new Uint8Array(await r.arrayBuffer());
    let s="";for(let i=0;i<buf.length;i+=0x8000) s+=String.fromCharCode.apply(null,buf.subarray(i,i+0x8000));return btoa(s);}
  function ensureLibs(){
    if(libs) return libs;
    libs=(async()=>{
      if(!window.pdfMake) await loadScript("vendor/pdfmake.min.js");
      const F={normal:"EBGaramond-Regular.ttf",bold:"EBGaramond-SemiBold.ttf",italics:"EBGaramond-Italic.ttf",bolditalics:"EBGaramond-SemiBoldItalic.ttf"};
      const vfs={}; await Promise.all(Object.values(F).map(async f=>{vfs[f]=await b64("fonts/"+f);}));
      window.pdfMake.vfs=vfs; window.pdfMake.fonts={Garamond:F};
    })().catch(e=>{libs=null;throw e;});
    return libs;
  }
  const pad=n=>String(n).padStart(2,"0");
  async function generate(opts){
    const date=opts&&opts.date||window.__lastDate; if(!date||!window.MatrixReading) throw new Error("Primero calcula una matriz.");
    await ensureLibs();
    const R=window.MatrixReading.compute(date.d,date.mo,date.y,null,{gender:date.g});   // fuente única de verdad
    const name=(opts&&opts.name||"").trim().slice(0,60);
    const birth=`${pad(date.d)}/${pad(date.mo)}/${date.y}`, today=new Date();
    const meta={name,birth,issued:today.toLocaleDateString("es",{day:"numeric",month:"long",year:"numeric"}),center:`${R.p.E} · ${LIB().DATA.arc[R.p.E].n}`};
    const doc=toPdf(build(R,meta),meta,await chartImage());
    const file=`Informe-MATRIX-${(name||birth).replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"")}.pdf`;
    return {doc,file,R};
  }
  // Descarga: dentro del visor de Claude se usa la capacidad "downloads" (el iframe bloquea las descargas
  // directas); en el sitio publicado, un enlace blob. Siempre se devuelve la URL para ofrecer "Abrir el PDF".
  async function download(opts){
    const {doc,file}=await generate(opts);
    const blob=await new Promise((ok,ko)=>{ try{ window.pdfMake.createPdf(doc).getBlob(ok); }catch(e){ ko(e); } });
    const url=URL.createObjectURL(blob);
    const dl=window.claude&&typeof window.claude.use==="function"?await window.claude.use("downloads").catch(()=>null):null;
    if(dl){
      try{ await dl.save({filename:file,data:blob}); return {file,url,status:"saved"}; }
      catch(e){ if(e&&e.code==="declined") return {file,url,status:"declined"}; /* si no, se intenta el enlace */ }
    }
    const a=document.createElement("a"); a.href=url; a.download=file; a.rel="noopener"; a.style.display="none";
    document.body.appendChild(a); a.click(); setTimeout(()=>a.remove(),0);
    return {file,url,status:"link"};
  }

  window.MatrixReport={build,generate,download,_toPdf:toPdf};
})();
