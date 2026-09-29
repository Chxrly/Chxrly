/* =====================================================================
   MATRIX · Motor de interpretación profunda, sistémica y conductual
   ---------------------------------------------------------------------
   Unidad básica:  ARCANO × POSICIÓN × ZONA × CONTEXTO
                   + repeticiones + programas + colas + relaciones.
   Fuentes (en orden de prioridad):
     matrix-data.js  → Biblioteca Maestra MATRIX (arcanos canónicos, 32 puntos,
                       35 contextos, zonas, programas publicables, 26 colas) +
                       diccionario semántico Arcano×zona y núcleos de programas.
     matrix-core.js  → núcleo conductual de los 22 Arcanos (capa editorial).
   Reglas del motor (no son doctrina de la fuente):
     · Punto eje de un programa = punto raíz de su zona (del que derivan los otros).
     · Un patrón global solo se muestra si lo respaldan ≥2 Arcanos en posiciones con peso.
     · Nunca se infiere si la persona está hoy en Hipo, Híper o integrada:
       se ofrecen señales para que la reconozca o la descarte.
   ===================================================================== */
(function(){
  "use strict";
  const DATA=window.MATRIX_DATA, CORE=window.MATRIX_CORE;
  /* ---------- Biblioteca v2 · 770 lecturas Arcano × Posición (plantillas verificadas en el build) ---------- */
  const V2=DATA.v2;
  const CIDS={}; Object.entries(V2.pos).forEach(([cid,x])=>(CIDS[x.punto]=CIDS[x.punto]||[]).push(cid));   // D1, X y C1 tienen dos contextos
  function v2read(a,cid,g){
    const A=Object.assign({},V2.arc[a],g==="H"?V2.arcM[a]:null), Q=Object.assign({},V2.pos[cid],g==="H"?V2.posM[cid]:null), d=Object.assign({},A,Q);
    const f=k=>V2.tpl[k][V2.use[k][cid]].replace(/\{(\w+)\}/g,(m,x)=>d[x]);
    return {cid,zona:Q.zona,posf:Q.posf,func:Q.func,preg:Q.preg,disp:Q.disp,prueba:Q.prueba,nec:A.nec,miedo:A.miedo,
      interp:f("interp"),hipo:f("hipo"),hiper:f("hiper"),eq:f("eq"),integ:f("integ"),pat:f("pat").replace(/\.$/,"").split(" → ")};
  }
  const v2arc=(a,g)=>Object.assign({},V2.arc[a],g==="H"?V2.arcM[a]:null);
  if(!DATA||!CORE){ console.warn("MATRIX: faltan datos"); return; }

  /* ---------- Cálculo canónico (Biblioteca Maestra · 10_FORMULAS) ---------- */
  const r22=n=>{ while(n>22) n=String(n).split("").reduce((a,d)=>a+ +d,0); return n; };
  function subdivide(a,b){const m=r22(a+b),q1=r22(a+m),q2=r22(m+b);
    return [a,r22(a+q1),q1,r22(q1+m),m,r22(m+q2),q2,r22(q2+b),b];}
  function points(day,month,year){
    const A=r22(day),B=r22(month),C=r22(String(year).split("").reduce((s,d)=>s+ +d,0));
    const Dd=r22(A+B+C),E=r22(A+B+C+Dd);
    const p={A,B,C,D:Dd,E};
    p.A2=r22(A+E);p.A1=r22(A+p.A2);p.A3=r22(p.A2+E);
    p.B2=r22(B+E);p.B1=r22(B+p.B2);p.B3=r22(p.B2+E);
    p.C1=r22(C+E);p.C2=r22(C+p.C1);p.D1=r22(Dd+E);p.D2=r22(Dd+p.D1);
    p.F=r22(A+B);p.G=r22(B+C);p.K=r22(Dd+A);p.Y=r22(C+Dd);
    p.E1=r22(p.F+p.G+p.K+p.Y);p.E2=r22(E+p.E1);
    p.S1=r22(p.E1+p.F);p.S2=r22(p.S1+p.F);p.P1=r22(p.G+p.E1);p.P2=r22(p.G+p.P1);
    p.P3=r22(p.K+p.E1);p.P4=r22(p.K+p.P3);p.S3=r22(p.Y+p.E1);p.S4=r22(p.S3+p.Y);
    p.X=r22(p.D1+p.C1);p.X1=r22(p.X+p.C1);p.X2=r22(p.X+p.D1);
    const cielo=r22(B+Dd),tierra=r22(A+C),personal=r22(cielo+tierra);
    const masc=r22(p.F+p.Y),fem=r22(p.G+p.K),social=r22(masc+fem);
    const espiritual=r22(personal+social),planetario=r22(espiritual+social);
    return {p,prop:{cielo,tierra,personal,masc,fem,social,espiritual,planetario}};
  }

  /* ---------- Lentes de zona ---------- */
  const ZT={
    retrato:{dom:"en cómo te muestras ante otros y en el trato entre padres e hijos",amb:"en el ámbito de tu imagen o de tu familia"},
    deseoF:{dom:"en lo que deseas para tu cuerpo, tu vida material y tus logros",amb:"en el ámbito de tus deseos materiales y corporales"},
    deseoE:{dom:"en tu búsqueda de sentido",amb:"en el ámbito de tu búsqueda de sentido"},
    talentos:{dom:"en el uso y la expresión de tus capacidades",amb:"en el ámbito de tus talentos y tu forma de expresarte"},
    material:{dom:"en el trabajo, el dinero y la seguridad material",amb:"en el ámbito del dinero y la seguridad material"},
    cola:{dom:"en situaciones que se repiten a lo largo de tu vida",amb:"en una situación que sientes repetida en tu vida"},
    centro:{dom:"en tu forma básica de funcionar, en cualquier área",amb:"en tu vida cotidiana"},
    intimidad:{dom:"en la intimidad y la sexualidad",amb:"en el ámbito de tu intimidad"},
    amor:{dom:"en la pareja y los vínculos cercanos",amb:"en el ámbito de tu pareja o tus vínculos cercanos"},
    dinero:{dom:"en el trabajo y la generación de ingresos",amb:"en el ámbito de tu trabajo y tus ingresos"},
    linPat:{dom:"frente a la autoridad, las normas, el rendimiento y lo que «hay que» lograr",amb:"en relación con lo heredado de tu línea paterna (autoridad, normas, logro)"},
    linMat:{dom:"en lo emocional, el cuidado, la pertenencia y la familia",amb:"en relación con lo heredado de tu línea materna (emociones, cuidado, pertenencia)"}
  };

  /* ---------- Rol de cada uno de los 32 puntos ---------- */
  function lin(P,line,kind){
    const pat=line==="paterna", rama=pat?"masculina":"femenina", tema=pat?"autoridad, límites, lógica y acción":"emociones, intuición, vínculos y receptividad";
    const zt=pat?"linPat":"linMat";
    const R={
      raizD:{frame:`${P} es la raíz de los dones de la línea ${line}: dentro del marco simbólico del método, el recurso que se transmite por la rama ${rama}, asociada a ${tema}.`,
        hipoF:`Si la raíz se vive desde la carencia, el don ${pat?"paterno":"materno"} llega debilitado o prohibido.`,
        hiperF:`Si se vive desde el exceso, el don ${pat?"paterno":"materno"} llega convertido en exigencia.`,
        sig:`Reconoces esta cualidad en personas de tu línea ${line}, en su versión luminosa o en su sombra.`,
        preg:`¿Qué recibí de mi línea ${line} que puedo usar a mi manera?`,short:`raíz de dones ${pat?"paternos":"maternos"}`},
      raizP:{frame:`${P} es la raíz de los patrones de la línea ${line}: creencias, bloqueos y aprendizajes que, en el lenguaje simbólico del método, se heredan por la rama ${rama}.`,
        hipoF:`El patrón heredado en Hipo es una limitación transmitida: «en esta familia no se hace».`,
        hiperF:`El patrón heredado en Híper es un exceso transmitido: «en esta familia hay que hacerlo así, y siempre».`,
        sig:`Una frase o creencia de tu línea ${line} aparece en tu cabeza en los momentos difíciles.`,
        preg:`¿Qué creencia de mi línea ${line} sigo aplicando sin revisarla?`,short:`raíz de patrones ${pat?"paternos":"maternos"}`},
      don:{frame:`${P} es un talento heredado de la línea ${line} y la sombra que puede acompañarlo.`,
        hipoF:`En Hipo, el talento heredado queda inhibido: está, pero no te das permiso de usarlo.`,
        hiperF:`En Híper, el talento se sobreactúa y trae consigo el costo emocional con que pudo transmitirse.`,
        sig:`Cuando usas esta cualidad sientes a la vez orgullo y un peso que no es del todo tuyo.`,
        preg:`¿Qué talento heredé y qué costo emocional venía con él?`,short:`talento heredado`},
      resp:{frame:`${P} es la respuesta adaptativa: la forma automática en que reaccionas ante la tensión heredada de la línea ${line}.`,
        hipoF:`La respuesta automática en Hipo es retirarse: {hipoC}.`,
        hiperF:`La respuesta automática en Híper es sobrecompensar: {hiperC}.`,
        sig:pat?`Ante la presión o la autoridad reaccionas de una forma que reconoces como aprendida.`:`Ante el conflicto emocional o familiar reaccionas de una forma que reconoces como aprendida.`,
        preg:pat?`¿Cómo reacciono cuando una figura de autoridad me presiona?`:`¿Cómo reacciono cuando alguien de mi familia está mal?`,short:`respuesta adaptativa`},
      nudo:{frame:`${P} es ${pat?"el mandato o la exigencia":"el nudo o la lealtad no resuelta"} de la línea ${line}: lo que mantiene activo el patrón heredado.`,
        hipoF:`${pat?"El mandato":"El nudo"} en Hipo es una lealtad silenciosa: repetir la limitación para no traicionar a la familia.`,
        hiperF:`${pat?"El mandato":"El nudo"} en Híper es una carga: sostener el exceso como si fuera una obligación heredada.`,
        sig:`Sientes culpa cuando haces algo distinto a lo que se hacía en tu línea ${line}.`,
        preg:`¿Qué ${pat?"mandato":"lealtad"} de mi línea ${line} sigo cumpliendo sin ${pat?"haberlo":"haberla"} elegido?`,short:pat?"mandato heredado":"nudo o lealtad"},
      recurso:{frame:`${P} es el recurso que se libera al integrar el programa de la línea ${line}: la ${pat?"maestría de acción":"sabiduría"} disponible cuando ${pat?"el mandato":"el nudo"} se resuelve.`,
        hipoF:`Mientras ${pat?"el mandato":"el nudo"} no se resuelve, este recurso queda en Hipo: disponible, pero sin usar.`,
        hiperF:`Si se fuerza, el recurso se usa en su versión distorsionada: {hiperC}.`,
        integF:`Esta posición es, en sí misma, la cosecha: cuanto más te reconoces en la integración, más se libera la herencia como capacidad y no como obligación.`,
        sig:`En tus mejores momentos muestras una cualidad que en tu línea ${line} estaba bloqueada.`,
        preg:`¿Qué capacidad aparece en mí cuando dejo de repetir la historia familiar?`,short:pat?"maestría liberada":"recurso liberado"}
    }[kind];
    return Object.assign({zt},R);
  }
  const ROLE={
    A:{zt:"retrato",short:"primera impresión",frame:"A es la primera impresión: la energía que los demás perciben antes de conocerte.",
      hipoF:"Aquí la Hipo se nota en la imagen: la energía que podrías mostrar queda escondida o apagada ante otros.",
      hiperF:"Aquí la Híper se nota como una imagen exagerada o rígida, una máscara que otros perciben antes que a ti.",
      sig:"La gente te describe de forma muy distinta a como te sientes por dentro.",preg:"¿Qué ven los demás de mí antes de conocerme, y se parece a quien soy?"},
    A1:{zt:"retrato",short:"equilibrio padres-hijos",frame:"A1 muestra qué necesita equilibrarse en el vínculo entre padres e hijos: con tus padres y, si los tienes, con tus hijos.",
      hipoF:"En el vínculo padres-hijos, la Hipo aparece como ausencia: lo que esta energía podría aportar al vínculo no se ofrece.",
      hiperF:"En el vínculo padres-hijos, la Híper aparece como exceso: la energía se impone y ocupa el espacio del otro.",
      sig:"Reconoces esta dinámica tanto en cómo te trataron como en cómo tratas a personas más jóvenes o dependientes.",preg:"¿Qué repetí de mis padres que me gustaría equilibrar?"},
    A2:{zt:"retrato",short:"error a no repetir",frame:"A2 señala el error relacional que conviene observar para no repetirlo en el vínculo padres-hijos.",
      hipoF:"El error aquí toma la forma de la Hipo: la energía se retira justo cuando el vínculo la necesita.",
      hiperF:"El error aquí toma la forma de la Híper: la energía se exagera y se transmite como exigencia o carga.",
      sig:"Te sorprendes repitiendo una frase o reacción de tus padres que te habías prometido no repetir.",preg:"¿Qué error de trato me prometí no repetir y a veces repito?"},
    A3:{zt:"deseoF",short:"deseo terrenal",frame:"A3 muestra un deseo físico o terrenal: lo que tu cuerpo, tu vida material y tus logros buscan vivir.",
      hipoF:"Cuando este deseo cae en Hipo, se posterga o se niega, y aparece una insatisfacción difusa.",
      hiperF:"Cuando cae en Híper, el deseo se persigue con urgencia y nunca parece suficiente.",
      sig:"Hay un deseo concreto que reconoces pero pospones año tras año.",preg:"¿Qué deseo material o corporal me estoy negando?"},
    B:{zt:"talentos",short:"talento principal",frame:"B es tu talento principal y tu vía natural de conexión con el camino de vida.",
      hipoF:"Un talento en Hipo queda sin uso: está, pero no se practica ni se muestra.",
      hiperF:"Un talento en Híper se sobreexplota o se vuelve una identidad rígida: todo pasa por él.",
      sig:"Otras personas te señalan una capacidad que tú no valoras o no usas.",preg:"¿Qué capacidad natural uso menos de lo que podría?"},
    B1:{zt:"talentos",short:"talento mental disponible",frame:"B1 es un talento mental ya disponible: una habilidad que no necesitas aprender desde cero.",
      hipoF:"En Hipo, esta capacidad disponible se desperdicia por no confiar en ella.",
      hiperF:"En Híper, se abusa de ella: se piensa de más y la mente se usa para no sentir o no actuar.",
      integF:"Como es un recurso ya disponible, suele ser el primer lugar desde donde puedes trabajar las zonas más difíciles de tu matriz.",
      sig:"Resuelves con facilidad problemas que a otros les cuestan, pero no lo consideras un mérito.",preg:"¿Qué sé hacer con facilidad y doy por sentado?"},
    B2:{zt:"talentos",short:"expresión a desarrollar",frame:"B2 es la autoexpresión a desarrollar: aquello que requiere práctica para convertirse en una forma clara de comunicar.",
      hipoF:"En Hipo, la expresión se bloquea: sabes, pero no lo dices o no lo muestras.",
      hiperF:"En Híper, la expresión sale forzada o excesiva y no transmite lo que realmente quieres.",
      sig:"Te cuesta explicar lo que sabes o sientes con la claridad con que lo piensas.",preg:"¿Qué me cuesta expresar aunque lo tenga claro por dentro?"},
    B3:{zt:"deseoE",short:"anhelo del alma",frame:"B3 es un anhelo espiritual: lo que buscas comprender y vivir más allá de lo material.",
      hipoF:"En Hipo, este anhelo se ignora y la vida pierde sentido trascendente.",
      hiperF:"En Híper, la búsqueda espiritual se usa para evadir la vida concreta.",
      sig:"Sientes una búsqueda de sentido que no terminas de traducir a tu vida diaria.",preg:"¿Qué busco más allá de lo material y cómo lo vivo en lo cotidiano?"},
    C:{zt:"material",short:"lección material",frame:"C es la lección material inicial: cómo aprendes a relacionarte con el trabajo, los recursos y la estabilidad.",
      hipoF:"Aquí la Hipo se traduce en bloqueos materiales: evitar, postergar o no reclamar lo que te corresponde.",
      hiperF:"Aquí la Híper se traduce en exceso material: controlar, acumular o forzar resultados económicos.",
      sig:"Tus dificultades con el dinero se repiten con formas distintas pero con la misma dinámica.",preg:"¿Qué patrón se repite en mi relación con el dinero?"},
    C2:{zt:"material",short:"conducta detonante",frame:"C2 es el comportamiento que agrava o detona la lección material: la conducta automática que conviene reconocer a tiempo.",
      hipoF:"Esta posición muestra la conducta que detona el bloqueo: cuando {hipoC}, las decisiones económicas se frenan.",
      hiperF:"También puede detonarlo el extremo contrario: cuando {hiperC}, las decisiones económicas se precipitan o se tensan.",
      sig:"Justo antes de un problema económico reconoces siempre la misma reacción tuya.",preg:"¿Qué hago yo, justo antes, cada vez que el dinero se complica?"},
    C1:{zt:"material",short:"vía de abundancia",frame:"C1 es tu vía de abundancia: la energía que, bien usada, abre el flujo de recursos. Es un punto compartido: también forma parte del Canal del Dinero.",
      hipoF:"En Hipo, la vía de abundancia existe pero no se activa: la energía que podría generar valor queda sin usar.",
      hiperF:"En Híper, se fuerza: se intenta generar dinero desde la parte distorsionada de la energía.",
      integF:"Cuando esta energía está integrada, suele notarse en el flujo concreto de recursos: es un indicador visible de tu trabajo interior.",
      sig:"Cuando usas esta cualidad en tu trabajo el dinero fluye mejor; cuando la dejas de lado, se frena.",preg:"¿Qué cualidad mía genera valor cuando la uso en el trabajo?"},
    D:{zt:"cola",short:"resultado de la cola",frame:"D es el resultado de tu Cola kármica: dentro del lenguaje simbólico de esta metodología, el bagaje o aprendizaje central que busca integrarse.",
      hipoF:"Como resultado del patrón, la Hipo se vive como una conclusión repetida: la vida parece confirmar una y otra vez la misma limitación.",
      hiperF:"Como resultado del patrón, la Híper se vive como una compensación que se repite: la misma respuesta excesiva en contextos distintos.",
      sig:"Sientes que cierta situación «siempre te pasa», con personas distintas.",preg:"¿Qué situación siento que se repite en mi vida con distintos protagonistas?"},
    D1:{zt:"cola",short:"puerta de entrada",frame:"D1 es la puerta de entrada de la Cola kármica: la influencia simbólica del pasado que se activa primero. Es un punto compartido: también es el karma relacional del Canal del Amor.",
      hipoF:"Como puerta de entrada, la Hipo aparece como una retirada automática que se activa antes de pensar, sobre todo en los vínculos.",
      hiperF:"Como puerta de entrada, la Híper aparece como una reacción intensa que se dispara antes de pensar, sobre todo en los vínculos.",
      sig:"Tu reacción ante ciertas situaciones de pareja es más intensa de lo que la situación explica.",preg:"¿Qué reacción mía se dispara antes de que pueda pensarla?"},
    D2:{zt:"cola",short:"estrategia aprendida",frame:"D2 es la estrategia aprendida: la forma en que el patrón de la cola se sostiene y se repite.",
      hipoF:"La estrategia aprendida en Hipo es evitar: {hipoC}.",
      hiperF:"La estrategia aprendida en Híper es compensar: {hiperC}.",
      sig:"Usas la misma estrategia para resolver problemas muy distintos.",preg:"¿Qué estrategia uso siempre, aunque ya no me sirva?"},
    E:{zt:"centro",short:"centro",frame:"E es tu centro: la esencia que organiza el tono de toda la matriz y el punto donde se integran Cielo y Tierra.",
      hipoF:"Cuando el centro cae en Hipo, toda la matriz pierde energía: te desconectas de tu forma natural de funcionar.",
      hiperF:"Cuando el centro cae en Híper, su exceso tiñe todas las áreas de tu vida.",
      sig:"Reconoces esta dinámica en casi todas las áreas de tu vida, no solo en una.",preg:"¿Qué parte de mí aparece en todo lo que hago?"},
    E1:{zt:"intimidad",short:"vivencia íntima",frame:"E1 es cómo vives por dentro la intimidad y la sexualidad.",
      hipoF:"En Hipo, la vivencia íntima se inhibe: falta permiso interno para reconocer deseos y límites.",
      hiperF:"En Híper, la vivencia íntima se sobrecarga: se busca en la intimidad algo que calme otras necesidades.",
      sig:"Tu forma de vivir la intimidad cambia mucho según tu estado emocional.",preg:"¿Qué me doy permiso de sentir en la intimidad y qué no?"},
    E2:{zt:"intimidad",short:"expresión íntima",frame:"E2 es cómo actúas y te expresas en la intimidad: cómo te acercas, marcas límites y muestras deseo.",
      hipoF:"En Hipo, la expresión íntima se contiene y el deseo no se comunica.",
      hiperF:"En Híper, la expresión íntima se impone o se usa para otros fines.",
      sig:"Te cuesta comunicar en la intimidad lo que quieres o no quieres.",preg:"¿Cómo expreso lo que deseo y lo que no quiero en la intimidad?"},
    X:{zt:"amor",short:"equilibrio amor-dinero",frame:"X es el punto de equilibrio entre la vida afectiva, la profesional y la financiera. Es un punto compartido por el Canal del Amor y el del Dinero.",
      hipoF:"En Hipo, el equilibrio se rompe por ausencia: una de las áreas queda desatendida.",
      hiperF:"En Híper, se rompe por exceso: un área invade a las demás.",
      sig:"Cuando mejora tu vida afectiva cambia tu trabajo, o al revés.",preg:"¿Qué área de mi vida sacrifico para sostener otra?"},
    X1:{zt:"dinero",short:"trabajo ideal",frame:"X1 muestra el trabajo ideal y la forma de favorecer el flujo económico.",
      hipoF:"En Hipo, esta cualidad no llega al trabajo y el flujo se frena.",
      hiperF:"En Híper, se usa de forma excesiva en el trabajo y desgasta.",
      integF:"Integrada, esta energía se convierte en una competencia reconocible por la que otros están dispuestos a pagar.",
      sig:"Tienes más energía en trabajos donde usas esta cualidad.",preg:"¿En qué tipo de trabajo esta energía se convierte en valor?"},
    X2:{zt:"amor",short:"pareja ideal",frame:"X2 describe la pareja ideal y las cualidades vinculares que favorecen el crecimiento.",
      hipoF:"En Hipo, buscas esta cualidad en el otro sin desarrollarla en ti.",
      hiperF:"En Híper, se le exige al vínculo o a la pareja de forma excesiva.",
      integF:"Integrada, esta energía deja de ser algo que buscas afuera y se convierte en la cualidad que tú aportas al vínculo.",
      sig:"Te atraen personas con esta cualidad, en su luz o en su sombra.",preg:"¿Qué cualidad busco en mi pareja que también necesito desarrollar?"},
    F:lin("F","paterna","raizD"),S1:lin("S1","paterna","don"),S2:lin("S2","paterna","resp"),
    G:lin("G","materna","raizD"),P1:lin("P1","materna","don"),P2:lin("P2","materna","resp"),
    K:lin("K","materna","raizP"),P4:lin("P4","materna","nudo"),P3:lin("P3","materna","recurso"),
    Y:lin("Y","paterna","raizP"),S4:lin("S4","paterna","nudo"),S3:lin("S3","paterna","recurso")
  };
  // Qué texto del diccionario semántico (.docx) contextualiza cada punto
  const DIC_KEY={A:"retrato",A1:"retrato",A2:"retrato",B:"talentos",B1:"talentos",B2:"talentos",C:"dinero",C2:"dinero",C1:"dinero",
    E:"centro",D1:"amor",X:"amor",X2:"amor",X1:"dinero",F:"linPat",S1:"linPat",S2:"linPat",Y:"linPat",S4:"linPat",S3:"linPat",
    G:"linMat",P1:"linMat",P2:"linMat",K:"linMat",P4:"linMat",P3:"linMat"};
  const BASE={
    A3:(n,r)=>`Con ${n} en A3, tu deseo terrenal busca experiencias donde vivir ${r}: en el cuerpo, en la vida material y en los logros`,
    B3:(n,r)=>`Con ${n} en B3, tu anhelo del alma busca comprender y vivir ${r} en un plano de sentido`,
    D:(n,r)=>`Con ${n} en D, dentro del lenguaje simbólico del método, el aprendizaje central consiste en integrar ${r} sin quedar fijado en ninguno de sus extremos`,
    D2:(n,r)=>`Con ${n} en D2, la estrategia aprendida gira alrededor de ${r}: un recurso valioso que, repetido de forma automática, se vuelve rígido`,
    E1:(n,r)=>`Con ${n} en E1, la intimidad se vive por dentro a través de ${r}`,
    E2:(n,r)=>`Con ${n} en E2, en la intimidad actúas y te expresas desde ${r}`
  };
  const ORDER=["E","E1","E2","D1","D2","D","X2","X","X1","B","B1","B2","A","A1","A2","C","C2","C1","A3","B3","F","S1","S2","G","P1","P2","K","P4","P3","Y","S4","S3"];
  const GROUPS=[
    {id:"CENTRO",t:"Centro y esencia",seq:"CENTRO_SEXUALIDAD",zon:"CENTRO_SEXUALIDAD",q:"Centro",pts:["E","E1","E2"]},
    {id:"COLA",t:"Cola kármica",seq:"COLA_KARMICA",zon:"COLA_KARMICA",q:"Cola kármica",pts:["D1","D2","D"]},
    {id:"AMOR",t:"Canal del Amor",seq:"CANAL_AMOR",zon:"CANAL_AMOR",q:"Amor",pts:["X2","X"],refs:["D1"]},
    {id:"DINERO",t:"Canal del Dinero",seq:"CANAL_DINERO",zon:"CANAL_DINERO",q:"Dinero",pts:["X1"],refs:["X","C1"]},
    {id:"TALENTOS",t:"Talentos",seq:"TALENTOS",zon:"TALENTOS",q:"Talentos",pts:["B","B1","B2"]},
    {id:"RETRATO",t:"Retrato y vínculo padres-hijos",seq:"RETRATO_FAMILIA",zon:"RETRATO",q:"Retrato",pts:["A","A1","A2"]},
    {id:"KARMA",t:"Karma material",seq:"KARMA_MATERIAL",zon:"KARMA_MATERIAL",q:"Karma material",pts:["C","C2","C1"]},
    {id:"DESEOS",t:"Deseos del cuerpo y del alma",seq:null,zon:"DESEOS",q:null,pts:["A3","B3"]},
    {id:"LPD",t:"Linaje paterno · dones",seq:"LIN_PAT_DONES",zon:"LIN_PAT_DONES",q:"Linaje paterno — dones",pts:["F","S1","S2"]},
    {id:"LMD",t:"Linaje materno · dones",seq:"LIN_MAT_DONES",zon:"LIN_MAT_DONES",q:"Linaje materno — dones",pts:["G","P1","P2"]},
    {id:"LMP",t:"Linaje materno · patrones",seq:"LIN_MAT_PATRONES",zon:"LIN_MAT_PATRONES",q:"Linaje materno — patrones",pts:["K","P4","P3"]},
    {id:"LPP",t:"Linaje paterno · patrones",seq:"LIN_PAT_PATRONES",zon:"LIN_PAT_PATRONES",q:"Linaje paterno — patrones",pts:["Y","S4","S3"]}
  ];
  // Regla del motor: punto eje = raíz de la zona (del que derivan los demás puntos)
  const ROOT={RETRATO_FAMILIA:"A",TALENTOS:"B",KARMA_MATERIAL:"C",COLA_KARMICA:"D",CENTRO_SEXUALIDAD:"E",CANAL_AMOR:"D1",CANAL_DINERO:"C1",
    LIN_PAT_DONES:"F",LIN_MAT_DONES:"G",LIN_MAT_PATRONES:"K",LIN_PAT_PATRONES:"Y"};
  // Peso de cada posición para respaldar patrones globales
  const W={E:3,D:2,D1:2,D2:2,X:1.5,C2:1.5,A:1,B:1,C:1,A2:1,B2:1,S4:1,P4:1,X1:1,X2:1};
  const RESOURCE=new Set(["B","B1","C1","X1","X2","S3","P3","E","A","S1","P1"]), CHALLENGE=new Set(["A2","C2","S4","P4","D","D2","D1","B2","C"]);

  /* ---------- Patrones globales (K) ---------- */
  const PATTERNS=[
    {id:"evit",t:"Evitación → sobrecompensación",chain:["evitas","la presión se acumula","sobrecompensas con exceso","pagas el costo del exceso","vuelves a evitar"],
     arc:{1:"ambos",4:"ambos",7:"ambos",8:"ambos",11:"ambos",12:"ambos",19:"ambos"},
     how:"Primero hay retirada: se posterga, se calla o se cede. Lo no hecho se acumula como presión y, cuando se vuelve insoportable, se descarga en el extremo contrario —control, prisa, dureza o exposición—. El costo de ese exceso da la razón a la retirada siguiente.",
     watch:"Pasas de «no hago nada» a «lo hago todo y a mi manera» sin estaciones intermedias.",
     move:"Busca el punto medio antes de que llegue la presión: un paso pequeño y regular vale más que una descarga intensa."},
    {id:"ideal",t:"Idealización → decepción",chain:["idealizas a una persona, un proyecto o un futuro","la realidad no coincide","llega la decepción","te retiras o buscas un ideal nuevo"],
     arc:{17:"hiper",6:"hiper",18:"hiper",12:"hiper",5:"hiper"},
     how:"El ideal protege de la incertidumbre y da sentido, pero exige que la realidad esté a su altura. Cuando no lo está, la decepción no se usa para ajustar la visión sino para abandonarla, y el ciclo recomienza con un ideal nuevo.",
     watch:"Tus relaciones o proyectos empiezan con entusiasmo intenso y terminan en desencanto parecido.",
     move:"Antes de entusiasmarte, anota tres datos concretos de la realidad; revísalos cuando aparezca la primera decepción, en lugar de descartar todo."},
    {id:"ctrl",t:"Control → resistencia → mayor control",chain:["controlas para sentir seguridad","el entorno se resiste","la resistencia se vive como amenaza","controlas más"],
     arc:{4:"hiper",1:"hiper",15:"hiper",8:"hiper",11:"hiper",7:"hiper",5:"hiper"},
     how:"El control nace para calmar un miedo, pero produce resistencia en quienes lo reciben. Esa resistencia se interpreta como prueba de que había que controlar, y la dosis aumenta.",
     watch:"Cuanto más te esfuerzas por ordenar algo, más se rebela o se aleja.",
     move:"Elige un área donde soltar una decisión durante dos semanas y observa qué ocurre sin tu intervención."},
    {id:"aprob",t:"Necesidad de aprobación → indecisión",chain:["necesitas aprobación","cada opción puede decepcionar a alguien","postergas o consultas de más","la indecisión aumenta la dependencia de la opinión ajena"],
     arc:{6:"ambos",19:"hiper",3:"hiper",2:"hipo",14:"hiper",5:"hipo"},
     how:"Cuando el criterio propio depende de la mirada ajena, elegir se vuelve peligroso: toda opción puede desagradar a alguien. La decisión se aplaza o se delega, y el criterio propio se debilita todavía más.",
     watch:"Antes de decidir algo tuyo necesitas varias opiniones, y aun así dudas.",
     move:"Toma una decisión pequeña por día sin consultar a nadie y registra qué pasa."},
    {id:"esfuerzo",t:"Sobreesfuerzo → agotamiento → postergación",chain:["te exiges al máximo","te agotas","postergas por cansancio","la culpa te lleva a sobreesforzarte otra vez"],
     arc:{7:"hiper",11:"hiper",21:"hiper",3:"hiper",20:"hiper",4:"hiper",12:"hipo"},
     how:"El esfuerzo intenso compensa una sensación de no hacer suficiente. Como no es sostenible, termina en agotamiento y postergación; la culpa por lo postergado empuja a un nuevo sobreesfuerzo.",
     watch:"Alternas semanas de rendimiento extremo con semanas en que no puedes empezar nada.",
     move:"Define un ritmo mínimo que puedas cumplir incluso con cansancio, y respétalo también cuando tengas energía de sobra."},
    {id:"sacrif",t:"Autosacrificio → resentimiento",chain:["renuncias a lo tuyo por otros","esperas reciprocidad sin pedirla","la reciprocidad no llega","aparece el resentimiento","culpa por el resentimiento y más sacrificio"],
     arc:{12:"hiper",6:"hiper",3:"hiper",14:"hiper",20:"hiper",2:"hipo"},
     how:"Dar sin pedir parece generoso, pero suele llevar una expectativa implícita. Cuando la reciprocidad no llega, el resentimiento aparece; como el resentimiento genera culpa, se compensa dando todavía más.",
     watch:"Sientes que das más de lo que recibes, pero te cuesta pedir.",
     move:"Pide explícitamente una cosa concreta esta semana, antes de dar la siguiente."},
    {id:"mostrarse",t:"Miedo a mostrarse → invisibilidad → falta de reconocimiento",chain:["temes mostrarte","te escondes o te minimizas","tu aporte no se ve","no llega el reconocimiento","se confirma que mostrarse no vale la pena"],
     arc:{17:"hipo",19:"hipo",2:"hipo",9:"hiper",21:"hipo",5:"hipo",3:"hipo"},
     how:"Esconder el talento protege de la crítica, pero vuelve invisible el aporte. La falta de reconocimiento se interpreta como prueba de que no había nada valioso que mostrar.",
     watch:"Otras personas descubren tarde capacidades tuyas que llevas años usando.",
     move:"Muestra una vez por semana algo que hiciste, sin esperar a que esté perfecto."},
    {id:"perder",t:"Miedo a perder → control → conflicto",chain:["temes perder","vigilas y controlas","el otro se siente presionado","aparece el conflicto","el conflicto confirma el miedo a perder"],
     arc:{15:"hiper",13:"hipo",4:"hiper",8:"hiper",18:"hiper",10:"hipo",6:"hiper"},
     how:"El miedo a perder intenta asegurar lo que importa, pero el control asfixia aquello que se quiere conservar. La tensión resultante genera distancia o conflicto, que confirma el miedo inicial.",
     watch:"Tus conflictos más fuertes aparecen con lo que más miedo tienes de perder.",
     move:"Cuando aparezca el impulso de revisar o asegurar, nombra el miedo en voz alta en lugar de actuarlo."},
    {id:"dispersion",t:"Dispersión → frustración → nueva búsqueda de estímulo",chain:["buscas estímulo","empiezas algo nuevo","el interés decae antes de consolidar","llega la frustración","buscas un estímulo nuevo"],
     arc:{22:"hiper",10:"hiper",3:"hiper",21:"hiper",16:"hiper",15:"hiper",7:"hiper"},
     how:"La novedad da energía, pero consolidar exige tolerar la rutina. Cuando el entusiasmo inicial baja, se vive como estancamiento y se busca un estímulo nuevo; la acumulación de inicios sin cierre produce frustración.",
     watch:"Tienes muchos comienzos recientes y pocos resultados sostenidos.",
     move:"Durante un mes, no empieces nada nuevo en un área sin cerrar antes una cosa en esa misma área."}
  ];

  /* ---------- Utilidades de texto ---------- */
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
  const low=s=>s?s.charAt(0).toLowerCase()+s.slice(1):s;
  const nodot=s=>String(s).replace(/\.\s*$/,"");
  const aMiedo=m=>m.startsWith("el ")?"al "+m.slice(3):"a "+m;
  const fill=(t,c)=>t.replace("{hipoC}",c.hipoC).replace("{hiperC}",c.hiperC);
  const pick=(arr,k,n)=>{const o=[];for(let i=0;i<n&&i<arr.length;i++)o.push(arr[(k+i)%arr.length]);return o;};
  const nm=a=>DATA.arc[a].n;
  const tag=(a)=>`<span class="rd-arc" title="${esc(nm(a))}">${a}</span>`;
  const ctxFor=P=>Object.values(DATA.ctx).filter(c=>c.punto===P);
  const zoneQ=key=>{if(!key)return "";const k=Object.keys(DATA.zoneQ).find(z=>z.startsWith(key));return k?DATA.zoneQ[k]:"";};

  /* ---------- I. Lectura por punto ---------- */
  function readPoint(P,a,idx,g){
    const c=CORE[a], R=ROLE[P], z=ZT[R.zt], arc=DATA.arc[a], k=idx;
    const v2=CIDS[P].map(cid=>v2read(a,cid,g));
    const dk=DIC_KEY[P], dic=dk?DATA.dic[a][dk]:"";
    const ctxs=ctxFor(P);
    const base=dic?`${arc.n} en ${P}: ${dic}`:BASE[P](arc.n,arc.rec);
    const extra=P==="X"?`En el trabajo y el dinero: ${DATA.dic[a].dinero}`:"";
    const trg=pick(c.trig,k,4);
    return {P,a,name:arc.n,role:R,v2,
      pos:`${R.frame} Función canónica: ${low(DATA.pts[P].func)}.`,
      patron:`${nodot(base)}.${extra?" "+nodot(extra)+".":""} El motor de fondo es la necesidad de ${c.nec}. Cuando esa necesidad se siente amenazada, aparece el miedo ${aMiedo(c.miedo)}, y la energía tiende a oscilar entre dos respuestas: en Hipo, la persona ${arc.hipo}; en Híper, ${arc.hiper}.`,
      nec:c.nec, miedo:c.miedo, dom:z.dom, trig:trg.slice(0,3),
      hipo:{frame:fill(R.hipoF,c), steps:[["Disparador",cap(trg[0])],["Pensamiento",c.pens],["Conducta",cap(c.cond)],["Consecuencia",cap(c.cons)]]},
      hiper:{frame:fill(R.hiperF,c), steps:[["Disparador",cap(trg[1])],["Necesidad de control",cap(c.necH)],["Exceso",cap(c.exc)],["Consecuencia",cap(c.consH)]]},
      ciclo:{txt:c.cicloTxt, chain:c.ciclo},
      eq:c.eq, integ:c.integ+(R.integF?" "+R.integF:""),
      signals:[...pick(c.sHipo,k,2).map(s=>["Hipo",s]),...pick(c.sHiper,k+1,2).map(s=>["Híper",s]),["Posición",low(R.sig)]],
      prog:pick(c.prog,k,4), preg:[...pick(c.preg,k,3),R.preg],
      acc:c.acc.replace("{amb}",z.amb),
      canon:ctxs.map(x=>({func:x.func,zona:x.zona,txt:x.tpl.replace(/\{(\w+)\}/g,(m,f)=>arc[f])}))};
  }

  /* ---------- D. Programas y E. Cola kármica ---------- */
  function detectPrograms(p){
    const out=[];
    DATA.seq.forEach(sq=>{
      const v=sq.pts.map(x=>p[x]), c3=v.join("-"), pairs=[v[0]+"-"+v[1],v[1]+"-"+v[2]];
      DATA.prg.forEach(pr=>{
        if(pr.cat==="COMPATIBILIDAD") return;
        const hit=pr.ar===3?pr.code===c3:pairs.includes(pr.code);
        if(!hit) return;
        if(sq.id==="COLA_KARMICA" && pr.cola26) return;           // la cola canónica se lee aparte
        if(out.some(o=>o.seq.id===sq.id&&o.prg.code===pr.code)) return;
        out.push({seq:sq,prg:pr,vals:v});
      });
    });
    return out;
  }
  function readProgram(o,p){
    const {seq,prg,vals}=o, eje=ROOT[seq.id], ea=p[eje], c=CORE[ea];
    const nuc=DATA.nuc[prg.code], zonaNom=seq.nombre, lens=DATA.lens[seq.id]||"";
    const pz=DATA.pz[`${seq.id}|${prg.code}`];
    return {id:`${seq.id}-${prg.code}`,seqId:seq.id,nombre:prg.nombre,code:prg.code,zona:zonaNom,seqPts:seq.pts,vals,
      fuenteZona:pz?pz.txt:"",
      nucleo:nuc?nuc.def:`Su recurso: ${low(prg.rec)} Su sombra: ${low(prg.sombra)}`,
      contexto:`En ${zonaNom}, este programa se interpreta en relación con ${lens}.`+(prg.cola26?" La combinación figura en el catálogo de colas, pero fuera de D1-D2-D no se etiqueta como Cola Kármica: se lee en el contexto de esta zona.":""),
      dist:seq.pts.map((P,i)=>({P,a:vals[i],rol:ROLE[P].short,func:DATA.pts[P].func})),
      eje,ea,
      enfasis:`El punto eje de esta zona es ${eje} (${ROLE[eje].short}) y lo ocupa ${nm(ea)} (${ea}): por eso el programa gira sobre todo en torno a ${c.kern}, y su versión sana depende de ${c.obj}.`.replace(/\bde el\b/g,"del").replace(/\ba el\b/g,"al"),
      potencial:prg.rec,
      hipo:`En Hipo, ese potencial queda sin desarrollar. Con ${nm(ea)} en el eje, la evitación suele verse así: ${c.hipoC}.`,
      hiper:`En Híper aparece la sombra del programa: ${low(prg.sombra)} Con el eje en ${nm(ea)}, la compensación suele verse así: ${c.hiperC}.`,
      ciclo:c.cicloTxt, chain:c.ciclo,
      costo:`${cap(c.cons)}; o, en el otro extremo, ${c.consH}.`,
      equilibrio:prg.tarea, integ:c.integ, sombra:prg.sombra, tarea:prg.tarea, trig:pick(c.trig,0,3), eq:c.eq.slice(0,2),
      acc:c.acc.replace("{amb}",ZT[ROLE[eje].zt].amb),
      alertas:[c.sHipo[0],c.sHiper[0],`notas en ti esta dinámica: ${low(nodot(prg.sombra))}`],
      progreso:pick(c.prog,1,3),
      preguntas:[`¿Dónde aparece en mi vida «${prg.nombre}»?`,...pick(c.preg,0,2)],
      aviso:prg.aviso};
  }
  function readCola(p){
    const [d1,d2,d]=[p.D1,p.D2,p.D], code=`${d1}-${d2}-${d}`, col=DATA.col.find(x=>x.code===code);
    const c1=CORE[d1],c2=CORE[d2],c3=CORE[d];
    return {code,vals:[d1,d2,d],col,
      chain:[["Disparador (D1 · puerta de entrada)",`${cap(c1.trig[0])}: se activa ${c1.kern} del ${d1}.`],
             ["Respuesta (D2 · estrategia aprendida)",`${cap(c2.cond)}; o, en su versión compensada, ${c2.exc}.`],
             ["Consecuencia (D · resultado)",`${cap(c3.cons)}; o bien ${c3.consH}.`],
             ["Retroalimentación",`Esa consecuencia refuerza ${c1.kern}, y la próxima vez la puerta de entrada se abre antes y con más fuerza.`]],
      hipo:`Evitas vivir el aprendizaje: en el resultado, ${c3.hipoC}; como estrategia aprendida, ${c2.hipoC}.`,
      hiper:`Sobreactivas la misma dinámica: en el resultado, ${c3.hiperC}; empujada por la necesidad de ${c1.necH}.`,
      eq:col?col.integ:cap(c3.eq[0])+".",
      integ:`Cuando aparece exactamente el antiguo disparador —${c1.trig[0]}—, la respuesta cambia: ${low(c2.integ)}`};
  }

  /* ---------- F. Repeticiones ---------- */
  // Arcanos que no aparecen en ninguno de los 32 puntos (Biblioteca v2 · Fuente_Global_Ausencia)
  function readAbsent(p,g){
    const present=new Set(ORDER.map(P=>p[P]));
    return Array.from({length:22},(_,i)=>i+1).filter(a=>!present.has(a)).map(a=>({a,name:nm(a),txt:v2arc(a,g).aus}));
  }
  function readRepetitions(p,g){
    const map={}; ORDER.forEach(P=>(map[p[P]]=map[p[P]]||[]).push(P));
    return Object.entries(map).filter(([a,ps])=>ps.length>=2).sort((x,y)=>y[1].length-x[1].length).map(([a,ps])=>{
      a=+a; const c=CORE[a];
      const res=ps.filter(P=>RESOURCE.has(P)), chal=ps.filter(P=>CHALLENGE.has(P));
      const transfer=res.length&&chal.length
        ?`Lo que puede funcionar en ${res[0]} (${ROLE[res[0]].short}) es transferible a ${chal[0]} (${ROLE[chal[0]].short}): ${c.eq[0]}.`
        :`Si en alguna de estas áreas ya manejas bien esta energía, observa qué haces allí de forma concreta y llévalo a las demás.`;
      return {a,name:nm(a),count:ps.length,level:ps.length>=3?"dominante":"tema importante",
        pos:ps.map(P=>({P,rol:ROLE[P].short,func:DATA.pts[P].func})),
        link:`En todas estas posiciones se juega ${c.kern}: la necesidad de ${c.nec}.`,
        risk:`El mismo automatismo —${c.hipoC}, o en el otro extremo ${c.hiperC}— puede repetirse en áreas que parecen no tener relación: ${ps.map(P=>ROLE[P].short).join(", ")}.`,
        transfer, dicRep:DATA.dic[a].repeticion, v2rep:v2arc(a,g).rep};
    });
  }

  /* ---------- G. Ejes y combinaciones ---------- */
  const causal=(a,b,c,pa,pb,pc)=>`${cap(CORE[a].kern)} del ${a} en ${pa} puede ${CORE[a].bloq} ${CORE[b].obj} del ${b} en ${pb}; ${CORE[b].cuando}, el ${c} en ${pc} puede ${CORE[c].comp}.`;
  function readAxes(p,prop){
    const ax=[];
    DATA.seq.forEach(sq=>{const [x,y,z]=sq.pts; ax.push({t:sq.nombre,code:sq.pts.map(P=>p[P]).join("-"),pts:sq.pts,txt:causal(p[x],p[y],p[z],x,y,z)});});
    ax.push({t:"Línea del Cielo (B + D)",code:`${p.B}-${p.D}-${prop.cielo}`,pts:["B","D","Cielo"],
      txt:`${cap(CORE[p.D].kern)} del ${p.D} en D puede ${CORE[p.D].bloq} ${CORE[p.B].obj} del ${p.B} en B; ${CORE[p.B].cuando}, el ${prop.cielo} de la línea del Cielo puede ${CORE[prop.cielo].comp}.`});
    ax.push({t:"Línea de la Tierra (A + C)",code:`${p.A}-${p.C}-${prop.tierra}`,pts:["A","C","Tierra"],
      txt:`${cap(CORE[p.C].kern)} del ${p.C} en C puede ${CORE[p.C].bloq} ${CORE[p.A].obj} del ${p.A} en A; ${CORE[p.A].cuando}, el ${prop.tierra} de la línea de la Tierra puede ${CORE[prop.tierra].comp}.`});
    ax.push({t:"Amor ↔ Dinero (X = D1 + C1)",code:`${p.X2}-${p.X}-${p.X1}`,pts:["X2","X","X1"],
      txt:causal(p.X2,p.X,p.X1,"X2","X","X1")+" A la inversa: "+low(causal(p.X1,p.X,p.X2,"X1","X","X2"))});
    return ax;
  }

  /* ---------- K. Patrones globales ---------- */
  function readPatterns(p){
    return PATTERNS.map(pt=>{
      const ev=ORDER.filter(P=>pt.arc[p[P]]&&(W[P]||0)>0).map(P=>({P,a:p[P],w:W[P],pole:pt.arc[p[P]]}));
      const distinct=new Set(ev.map(e=>e.a)).size, score=ev.reduce((s,e)=>s+e.w,0);
      return {pt,ev,distinct,score};
    }).filter(x=>x.distinct>=2&&x.score>=4).sort((a,b)=>b.score-a.score).map(x=>({...x,
      ev:x.ev.map(e=>({...e,txt:e.pole==="hipo"?CORE[e.a].hipoC:e.pole==="hiper"?CORE[e.a].hiperC:`${CORE[e.a].hipoC} → ${CORE[e.a].hiperC}`}))}));
  }

  /* ---------- Ciclo actual (perímetro validado) ---------- */
  function readCycle(p,birth,today){
    const RING=["A","F","B","G","C","Y","D","K"];
    // Edad cumplida + fracción del año en curso (calendario real): el día del cumpleaños cae
    // exactamente en el inicio de un tramo, sin el desfase de dividir por 365,24 días.
    const t0=new Date(today.getFullYear(),today.getMonth(),today.getDate());
    const anniv=n=>new Date(birth.getFullYear()+n,birth.getMonth(),birth.getDate());
    let yrs=t0.getFullYear()-birth.getFullYear(); if(anniv(yrs)>t0) yrs--;
    const ageYears=yrs+(t0-anniv(yrs))/(anniv(yrs+1)-anniv(yrs));
    const age=((ageYears%80)+80)%80, seg=Math.floor(age/10), j=Math.floor((age-seg*10)/1.25);
    const vals=subdivide(p[RING[seg]],p[RING[(seg+1)%8]]);
    const a=vals[j], nextAge=Math.floor(ageYears/1.25+1)*1.25;
    const nm80=((nextAge%80)+80)%80, seg2=Math.floor(nm80/10), j2=Math.round((nm80-seg2*10)/1.25);
    const vals2=subdivide(p[RING[seg2]],p[RING[(seg2+1)%8]]), a2=j2===8?p[RING[(seg2+1)%8]]:vals2[j2];
    const upcoming=[];
    for(let i=0;i<6;i++){ const st=Math.floor(ageYears/1.25+i)*1.25, sm=((st%80)+80)%80, s2=Math.floor(sm/10), jj=Math.round((sm-s2*10)/1.25);
      const vv=subdivide(p[RING[s2]],p[RING[(s2+1)%8]]); upcoming.push({from:st,to:st+1.25,a:jj===8?p[RING[(s2+1)%8]]:vv[jj]}); }
    return {age:ageYears,from:Math.floor(ageYears/1.25)*1.25,to:nextAge,a,next:a2,txt:DATA.anual[a],upcoming};
  }

  /* ---------- Cómputo completo ---------- */
  function compute(day,month,year,today,opts){
    const g=(opts&&opts.gender)||"M";
    const {p,prop}=points(day,month,year);
    const reads={}; ORDER.forEach((P,i)=>reads[P]=readPoint(P,p[P],i,g));
    const programs=detectPrograms(p).map(o=>readProgram(o,p));
    const cola=readCola(p), reps=readRepetitions(p,g), absent=readAbsent(p,g), center=v2arc(p.E,g), axes=readAxes(p,prop), patternsAll=readPatterns(p), patterns=patternsAll.slice(0,3);
    const cycle=readCycle(p,new Date(year,month-1,day),today||new Date());
    return {p,prop,reads,programs,cola,reps,absent,center,axes,patterns,patternsAll,cycle,gender:g};
  }

  /* ---------- J. Cómo se conecta todo ---------- */
  function integration(R){
    const {p,prop}=R, C=CORE, out=[];
    out.push(["Centro",`Tu centro es ${nm(p.E)} (${p.E}). ${cap(nodot(DATA.dic[p.E].centro))}. Todo lo demás se lee a su luz: la necesidad de ${C[p.E].nec} tiñe cada área, y cuando el centro se desbalancea el efecto se nota en varias zonas a la vez.`]);
    const dom=R.reps.filter(r=>r.count>=2);
    if(R.absent.length) out.push(["Arcanos ausentes",`No aparecen en tu matriz: ${R.absent.map(x=>`${x.name} (${x.a})`).join(", ")}. Son cualidades que no llegan «de serie» y que puedes entrenar deliberadamente; muchas veces lo que falta se busca fuera, en personas o situaciones que la encarnan.`]);
    if(dom.length) out.push(["Arcanos dominantes",dom.map(r=>`${r.name} (${r.a}) aparece ${r.count} veces —${r.pos.map(x=>x.P).join(", ")}—`).join("; ")+`. Donde una energía se repite, sus dos extremos tienen más ocasiones de aparecer; por eso conviene observarla primero en el área donde más te cuesta y trabajarla desde el área donde mejor la manejas.`]);
    else out.push(["Arcanos dominantes","Ningún Arcano se repite: tu matriz reparte la energía entre muchas cualidades distintas. El reto no es moderar un tema dominante, sino integrar energías que a veces piden cosas contrarias."]);
    if(R.programs.length) out.push(["Programas",R.programs.map(g=>`«${g.nombre}» (${g.code}) en ${g.zona}, con ${nm(g.ea)} en el eje ${g.eje}`).join("; ")+"."+(R.programs.some(g=>g.ea===p.E)?` Uno de ellos tiene como eje a tu mismo Arcano central, así que el programa no es un tema lateral: expresa tu esencia en esa zona.`:` Ninguno tiene como eje a tu Arcano central: funcionan como temas de zona que tu centro puede ordenar.`)]);
    out.push(["Cola kármica → Centro → Amor",`Tu cola termina en ${nm(p.D)} (${p.D}). Como D1 se calcula a partir de D y E, tu bagaje y tu esencia se encuentran en D1 = ${p.D1} (${nm(p.D1)}), que es a la vez la puerta de la cola y el karma relacional del Canal del Amor. Por eso, dentro del lenguaje simbólico del método, lo que traes como patrón suele aparecer primero en los vínculos: ${C[p.D1].kern} es la primera señal a observar.`]);
    out.push(["Amor y Dinero",`El nodo X = ${p.X} (${nm(p.X)}) reparte la energía entre la pareja (X2 = ${p.X2}, ${nm(p.X2)}) y el trabajo (X1 = ${p.X1}, ${nm(p.X1)}). Si ${C[p.X2].obj} se estanca en la pareja, es frecuente compensarlo en el trabajo: ${C[p.X1].comp}; y a la inversa. La vía de abundancia C1 = ${p.C1} (${nm(p.C1)}) es la otra entrada de X: lo que ordenas en el dinero repercute en tus vínculos.`]);
    out.push(["Talentos como recurso",`B = ${p.B} (${nm(p.B)}) y B1 = ${p.B1} (${nm(p.B1)}) son recursos disponibles. Usados con conciencia, ${C[p.B1].obj} puede ayudarte donde más te cuesta —por ejemplo en C2 = ${p.C2} (${nm(p.C2)}), la conducta que detona tu lección material—. La expresión que aún necesita práctica está en B2 = ${p.B2} (${nm(p.B2)}).`]);
    out.push(["Linajes",`Por la línea paterna, el mandato S4 = ${p.S4} (${nm(p.S4)}) se transforma en maestría en S3 = ${p.S3} (${nm(p.S3)}); por la materna, el nudo P4 = ${p.P4} (${nm(p.P4)}) libera su recurso en P3 = ${p.P3} (${nm(p.P3)}). En ambos casos, el recurso no aparece rechazando la herencia sino revisándola: ${C[p.S4].kern} y ${C[p.P4].kern} son las dinámicas heredadas que conviene observar.`]);
    out.push(["Ejes",`La línea del Cielo (B + D = ${prop.cielo}, ${nm(prop.cielo)}) habla de conciencia y propósito; la de la Tierra (A + C = ${prop.tierra}, ${nm(prop.tierra)}), de acción y materialización. Ambas convergen en tu centro E = ${p.E}: cuando lo que buscas y lo que haces se desconectan, suele aparecer primero ${C[p.E].kern}.`]);
    out.push(["Propósitos",`El propósito personal (${prop.personal}, ${nm(prop.personal)}) suele pedir atención entre los 20 y los 40 años; el social (${prop.social}, ${nm(prop.social)}), entre los 40 y los 60; el espiritual (${prop.espiritual}, ${nm(prop.espiritual)}) acompaña toda la vida, y el planetario (${prop.planetario}, ${nm(prop.planetario)}) marca la contribución más amplia. Cada uno se apoya en el anterior: sin integrar ${CORE[prop.personal].obj}, el propósito social tiende a vivirse desde ${CORE[prop.social].kern}.`]);
    const cy=R.cycle; out.push(["Ciclo actual",`Con ${cy.age.toFixed(1).replace(".",",")} años, el tramo del perímetro que estás recorriendo lleva la energía de ${nm(cy.a)} (${cy.a}), desde los ${fmtAge(cy.from)} hasta los ${fmtAge(cy.to)} años; luego pasa a ${nm(cy.next)} (${cy.next}). No predice hechos: señala el tema que puede pedir más atención en este período.`]);
    return out;
  }
  const fmtAge=x=>(Math.round(x*100)/100).toString().replace(".",",");

  /* ---------- M. Resumen: las ocho preguntas ---------- */
  function summary(R){
    const {p}=R, e=CORE[p.E], d1=CORE[p.D1], d2=CORE[p.D2], top=R.patterns[0];
    return [
      ["¿Qué patrón tengo?", top?`Con más respaldo en tu matriz aparece «${top.pt.t}»: ${top.pt.chain.join(" → ")}. Tu centro (${nm(p.E)}) le da el tono: ${low(e.cicloTxt)}`:`Tu patrón central lo organiza tu centro, ${nm(p.E)}: ${e.ciclo.join(" → ")}. ${e.cicloTxt}`],
      ["¿Qué lo activa?",`Sobre todo situaciones como estas: ${e.trig[0]}; ${e.trig[2]}; y, por la puerta de tu cola kármica (D1 = ${p.D1}), ${d1.trig[0]}.`],
      ["¿Qué hago cuando se activa?",`La respuesta automática más probable: ${e.cond}. Como estrategia aprendida (D2 = ${p.D2}), también puede aparecer esto: ${d2.hipoC}.`],
      ["¿Cómo intento compensarlo?",`En el otro extremo, para ${e.necH}, ${e.exc}.`],
      ["¿Qué consecuencia genero?",`${cap(e.cons)}. O, cuando compensas, ${e.consH}.`],
      ["¿Cómo sé si entro en Hipo o en Híper?",`Señal de Hipo: ${e.sHipo[0]}. Señal de Híper: ${e.sHiper[0]}. Si te reconoces en ambas en distintos momentos, probablemente se trata del mismo ciclo visto desde sus dos extremos.`],
      ["¿Qué tendría que hacer diferente?",`La dirección es esta: ${e.eq[0]}. Un primer paso verificable: ${low(e.acc.replace("{amb}","en tu vida cotidiana"))}`],
      ["¿Cómo sabré que lo estoy integrando?",`${e.integ} Otro indicador: ${e.prog[0]}.`]
    ];
  }

  /* ---------- Render ---------- */
  function li(arr){return `<ul>${arr.map(x=>`<li>${esc(cap(x))}</li>`).join("")}</ul>`;}
  function steps(st,cls){return `<ol class="rd-steps ${cls}">${st.map(([k,v])=>`<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ol>`;}
  function chainHtml(ch,loop){return `<p class="rd-chain">${ch.map(x=>`<span>${esc(cap(x))}</span>`).join('<i aria-hidden="true">→</i>')}${loop?'<i aria-hidden="true">↺</i>':""}</p>`;}
  function v2block(v,main){
    return `<div class="rd-v2">
      ${main?"":`<p class="rd-ctx">También en <b>${esc(v.zona)}</b> · ${esc(v.posf)}</p>`}
      <p class="rd-lead">${esc(v.interp)}</p>
      <p class="rd-q"><span>Pregunta clave</span>${esc(v.preg)}</p>
      <h5>Qué puede activarla</h5><p>Situaciones como estas: ${esc(v.disp)}.</p>
      <div class="rd-two">
        <div class="rd-pole rd-hipo"><h5>Hipo · cuando el recurso se inhibe</h5><p>${esc(v.hipo)}</p></div>
        <div class="rd-pole rd-hiper"><h5>Híper · cuando se sobrecompensa</h5><p>${esc(v.hiper)}</p></div>
      </div>
      <h5>El patrón observable</h5>${chainHtml(v.pat,true)}
      <h5>Equilibrio</h5><p>${esc(v.eq)}</p>
      <h5>Integración</h5><p>${esc(v.integ)}</p></div>`;
  }
  function pointCard(r,open,R){
    const m=r.v2[0], cen=r.P==="E"&&R?R.center:null;
    return `<details class="rd-pt"${open?" open":""} id="rd-pt-${r.P}"><summary><span class="rd-pt-h"><b>${r.P} · ${esc(r.name)}</b> ${tag(r.a)}</span><span class="rd-pt-r">${esc(m.posf)}</span></summary>
    <div class="rd-pt-b">
      <h5>Qué representa esta posición</h5><p>${esc(cap(m.func))}. ${esc(r.role.frame)}</p>
      <h5>Lo que esta energía necesita</h5><p><b>Necesidad nuclear:</b> ${esc(cap(m.nec))}. <b>Miedo nuclear:</b> ${esc(cap(m.miedo))}.</p>
      ${cen?`<div class="rd-card rd-center"><h5>Tu centro según la biblioteca</h5><p>${esc(cen.cNuc)}</p><p><b>Sombra.</b> ${esc(cen.cSom)}</p><p><b>Clave estratégica.</b> ${esc(cen.cClave)}</p></div>`:""}
      ${r.v2.map((v,i)=>v2block(v,i===0)).join("")}
      <div class="rd-two">
        <div><h5>Puede que este patrón esté activo si…</h5><ul>${r.signals.map(([t,x])=>`<li><span class="rd-chip ${t==="Hipo"?"hipo":t==="Híper"?"hiper":""}">${t}</span> ${esc(cap(x))}</li>`).join("")}</ul></div>
        <div><h5>Probablemente lo estás trabajando bien si…</h5>${li(r.prog)}</div>
      </div>
      <h5>Preguntas para observarte</h5>${li(r.preg)}
      <h5>Acción concreta</h5><p class="rd-action">${esc(r.acc)}</p>
    </div></details>`;
  }
  function programCard(g){
    return `<article class="rd-card rd-prog"><header><h4>${esc(g.nombre)}</h4><span class="rd-code">${esc(g.code)}</span><span class="rd-muted">${esc(g.zona)}</span></header>
      <p><b>Núcleo.</b> ${esc(g.nucleo)}</p><p>${esc(g.contexto)}</p>${g.fuenteZona?`<p class="rd-src-zone"><b>Lectura documentada para esta zona.</b> ${esc(g.fuenteZona)}</p>`:""}
      <p class="rd-dist">${g.dist.map(d=>`<span><b>${d.P}</b> ${tag(d.a)} <em>${esc(d.rol)}</em></span>`).join('<i aria-hidden="true">→</i>')}</p>
      <p><b>Arcano eje.</b> ${esc(g.enfasis)}</p>
      <p><b>Potencial.</b> ${esc(g.potencial)}</p>
      <div class="rd-two"><div class="rd-pole rd-hipo"><h5>Hipo</h5><p>${esc(g.hipo)}</p></div><div class="rd-pole rd-hiper"><h5>Híper</h5><p>${esc(g.hiper)}</p></div></div>
      <h5>Ciclo</h5>${chainHtml(g.chain,true)}<p>${esc(g.ciclo)}</p>
      <p><b>Costo.</b> ${esc(g.costo)}</p><p><b>Equilibrio.</b> ${esc(g.equilibrio)}</p><p><b>Integración.</b> ${esc(g.integ)}</p>
      <div class="rd-two"><div><h5>Alertas</h5>${li(g.alertas)}</div><div><h5>Progreso</h5>${li(g.progreso)}</div></div>
      <h5>Preguntas espejo</h5>${li(g.preguntas)}
      <p class="rd-fine">Lectura simbólica: describe una dinámica posible, no un hecho ni una predicción.</p></article>`;
  }
  function render(date){
    const host=document.getElementById("lectura"); if(!host) return;
    const R=compute(date.d,date.mo,date.y,null,{gender:date.g});
    const {p}=R; let h="";
    h+=`<div class="section-head"><p class="eyebrow">Motor MATRIX · lectura profunda</p><h2>Tu patrón, paso a paso</h2>
      <p>La matriz muestra posibilidades de expresión, no tu estado actual. Lee cada señal y decide si te reconoces en ella o si la descartas.</p></div>
      <nav class="rd-index" aria-label="Secciones de la lectura">${[["rd-sum","Resumen"],["rd-pts","Los 32 puntos"],["rd-prg","Programas"],["rd-cola","Cola kármica"],["rd-rep","Repeticiones"],["rd-aus","Ausentes"],["rd-ax","Ejes"],["rd-pat","Patrones globales"],["rd-int","Cómo se conecta todo"]].map(([id,t])=>`<a href="#${id}">${t}</a>`).join("")}</nav>`;
    // M · Resumen
    h+=`<section class="rd-sec" id="rd-sum"><h3>Las ocho preguntas de tu lectura</h3><div class="rd-qa">${summary(R).map(([q,a])=>`<div class="rd-card"><h4>${esc(q)}</h4><p>${esc(a)}</p></div>`).join("")}</div></section>`;
    // I · Puntos por zona
    h+=`<section class="rd-sec" id="rd-pts"><h3>Los 32 puntos, zona por zona</h3><p class="rd-muted">Cada punto se lee como Arcano × posición × zona. Abre el que quieras explorar; el Centro y la Cola aparecen abiertos por su peso en la lectura.</p>`;
    GROUPS.forEach(g=>{
      const seqVals=g.pts.concat(g.refs||[]);
      const prg=R.programs.filter(x=>x.seqId===g.seq);
      const zon=DATA.zon[g.zon], q=zoneQ(g.q);
      h+=`<details class="rd-zone" ${g.id==="CENTRO"||g.id==="COLA"?"open":""}><summary><span><b>${esc(g.t)}</b> <span class="rd-code">${g.seq?DATA.seq.find(s=>s.id===g.seq).pts.map(P=>`${P} ${p[P]}`).join(" · "):seqVals.map(P=>`${P} ${p[P]}`).join(" · ")}</span></span>${prg.length?`<span class="rd-badge">${prg.length} programa${prg.length>1?"s":""}</span>`:""}</summary>
        <div class="rd-zone-b"><p class="rd-muted">${esc(zon?zon.lectura:"")}${q?" · "+esc(q):""}</p>
        ${g.pts.map(P=>pointCard(R.reads[P],P==="E"||P==="D",R)).join("")}
        ${(g.refs||[]).map(P=>`<p class="rd-ref">${P} = ${p[P]} (${esc(nm(p[P]))}) también forma parte de esta zona: <a href="#rd-pt-${P}">ver su lectura</a>.</p>`).join("")}
        ${prg.map(x=>`<p class="rd-ref">Programa activo en esta zona: <a href="#rd-p-${x.id}">«${esc(x.nombre)}» (${x.code})</a>.</p>`).join("")}</div></details>`;
    });
    h+=`</section>`;
    // D · Programas
    h+=`<section class="rd-sec" id="rd-prg"><h3>Programas activos</h3>`+(R.programs.length?`<p class="rd-muted">Solo se muestran programas documentados de la biblioteca cuya secuencia aparece en orden exacto dentro de una zona. Punto eje: raíz de la zona (regla del motor).</p>`+R.programs.map(g=>`<div id="rd-p-${g.id}">${programCard(g)}</div>`).join(""):`<p>No se detectan programas documentados en el orden exacto de ninguna zona. No se inventan combinaciones: la lectura se apoya en los puntos, las repeticiones y los ejes.</p>`)+`</section>`;
    // E · Cola
    const k=R.cola;
    h+=`<section class="rd-sec" id="rd-cola"><h3>Cola kármica · D1 → D2 → D = ${k.code}</h3>
      <p class="rd-muted">Dentro del lenguaje simbólico de esta metodología, D1 es la puerta de entrada u origen simbólico, D2 la estrategia o patrón aprendido y D el resultado o aprendizaje central. No se presenta como un hecho sobre vidas pasadas.</p>
      ${k.col?`<article class="rd-card"><header><h4>${esc(k.col.nombre)}</h4><span class="rd-code">${k.code}</span><span class="rd-muted">Catálogo canónico de 26 colas kármicas</span></header><p><b>Recurso.</b> ${esc(k.col.rec)}</p><p><b>Sombra.</b> ${esc(k.col.sombra)}</p></article>`
        :`<p>La combinación ${k.code} no pertenece al catálogo canónico de 26 colas, así que no se le asigna nombre. Aun así, la secuencia se lee con la misma lógica.</p>`}
      ${steps(k.chain,"cola")}
      <div class="rd-two"><div class="rd-pole rd-hipo"><h5>Hipo de la cola</h5><p>${esc(k.hipo)}</p></div><div class="rd-pole rd-hiper"><h5>Híper de la cola</h5><p>${esc(k.hiper)}</p></div></div>
      <p><b>Equilibrio.</b> ${esc(k.eq)}</p><p><b>Integración.</b> ${esc(k.integ)}</p><p class="rd-fine">Narrativa simbólica del método: no afirma vidas pasadas ni describe hechos verificables.</p></section>`;
    // F · Repeticiones
    const repCard=r=>`<article class="rd-card"><header><h4>${esc(r.name)} ${tag(r.a)}</h4><span class="rd-badge">${r.count} veces · ${r.level}</span></header>
      <p class="rd-dist">${r.pos.map(x=>`<span><b>${x.P}</b> <em>${esc(x.rol)}</em></span>`).join("")}</p>
      <p><b>Qué conecta estas posiciones.</b> ${esc(r.link)}</p><p><b>Qué puede repetirse.</b> ${esc(r.risk)}</p><p><b>Recurso transferible.</b> ${esc(r.transfer)}</p>
      <p><b>Según la biblioteca.</b> ${esc(r.v2rep)}</p><p class="rd-muted">${esc(r.dicRep)}</p></article>`;
    const rep3=R.reps.filter(r=>r.count>=3), rep2=R.reps.filter(r=>r.count===2);
    h+=`<section class="rd-sec" id="rd-rep"><h3>Repeticiones</h3>`+(R.reps.length
      ?`<p class="rd-muted">Una energía repetida no es «más positiva» ni «más negativa»: tiene más ocasiones de expresarse, en sus dos extremos. Lo útil es ver qué conducta común une las posiciones.</p>`
        +(rep3.length?rep3.map(repCard).join(""):`<p>Ningún Arcano aparece tres veces o más.</p>`)
        +(rep2.length?`<details class="rd-zone"><summary><span><b>Otras repeticiones</b> <span class="rd-code">${rep2.map(r=>r.a).join(" · ")}</span></span><span class="rd-badge">${rep2.length} Arcanos × 2</span></summary><div class="rd-zone-b">${rep2.map(repCard).join("")}</div></details>`:"")
      :`<p>Ningún Arcano se repite en tus 32 puntos.</p>`)+`</section>`;
    // Arcanos ausentes (nuevo cálculo: los que no aparecen en ninguno de los 32 puntos)
    h+=`<section class="rd-sec" id="rd-aus"><h3>Arcanos ausentes</h3>`+(R.absent.length
      ?`<p class="rd-muted">De los 22 Arcanos, ${R.absent.length===1?"uno no aparece":R.absent.length+" no aparecen"} en ninguno de tus 32 puntos. La ausencia no es una carencia fija: señala una cualidad que no te viene dada por estructura y que puede desarrollarse de forma consciente.</p><div class="rd-axes">`
        +R.absent.map(x=>`<div class="rd-card"><h4>${esc(x.name)} ${tag(x.a)}</h4><p>${esc(x.txt)}</p></div>`).join("")+`</div>`
      :`<p>Los 22 Arcanos aparecen al menos una vez en tus 32 puntos.</p>`)+`</section>`;
    // G · Ejes
    h+=`<section class="rd-sec" id="rd-ax"><h3>Ejes y combinaciones</h3><p class="rd-muted">No se suman definiciones: cada frase describe qué energía inicia el proceso, cuál responde y cuál compensa si la anterior se va a Hipo.</p><div class="rd-axes">${R.axes.map(a=>`<div class="rd-card"><h4>${esc(a.t)} <span class="rd-code">${a.code}</span></h4><p>${esc(a.txt)}</p></div>`).join("")}</div></section>`;
    // K · Patrones globales
    h+=`<section class="rd-sec" id="rd-pat"><h3>Patrones globales</h3>`+(R.patterns.length?`<p class="rd-muted">Solo aparecen los patrones respaldados por al menos dos Arcanos en posiciones con peso.</p>`+R.patterns.map(x=>`<article class="rd-card"><header><h4>${esc(x.pt.t)}</h4></header>${chainHtml(x.pt.chain,true)}
      <p>${esc(x.pt.how)}</p><h5>Respaldo en tu matriz</h5><ul>${x.ev.map(e=>`<li><b>${e.P}</b> ${tag(e.a)} ${esc(ROLE[e.P].short)}: ${esc(e.txt)}</li>`).join("")}</ul>
      <p><b>Señal de que está activo.</b> ${esc(x.pt.watch)}</p><p><b>Qué hacer distinto.</b> ${esc(x.pt.move)}</p></article>`).join(""):`<p>Ningún patrón global alcanza el respaldo mínimo en tu matriz. La lectura se concentra en las zonas y en tu centro.</p>`)+`</section>`;
    // J · Integración
    h+=`<section class="rd-sec" id="rd-int"><h3>Cómo se conecta todo</h3><div class="rd-int">${integration(R).map(([t,x])=>`<div class="rd-card"><h4>${esc(t)}</h4><p>${esc(x)}</p></div>`).join("")}</div>
      <p class="rd-fine">Herramienta simbólica de autoconocimiento. No sustituye consejo médico, psicológico, legal ni financiero, y no predice hechos.</p></section>`;
    host.innerHTML=h; host.hidden=false;
    if(window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  // Los enlaces internos abren los desplegables que contienen su destino
  document.addEventListener("click",ev=>{
    const a=ev.target.closest&&ev.target.closest('a[href^="#rd-"]'); if(!a) return;
    const t=document.getElementById(a.getAttribute("href").slice(1)); if(!t) return;
    for(let el=t;el;el=el.parentElement) if(el.tagName==="DETAILS") el.open=true;
  });

  window.MatrixReading={compute,render,points,_lib:{DATA,CORE,ROLE,ZT,GROUPS,ROOT,PATTERNS,RESOURCE,CHALLENGE}};
  if(window.__lastDate) render(window.__lastDate);   // si la carta ya se calculó antes de cargar el motor
})();
