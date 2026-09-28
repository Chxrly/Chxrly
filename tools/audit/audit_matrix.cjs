// Auditoría integral: oráculo (fórmulas literales de 11_MOTOR) vs. todo lo que calcula y muestra la plataforma.
// Uso: node tools/audit/audit_matrix.cjs <carpeta_con_oracle.json_y_rules.json> [fechas_en_pantalla=400] [url]
const { chromium } = require(process.env.PLAYWRIGHT_PATH||'playwright');
const ORA=require(require('path').resolve(process.argv[2],'oracle.json')), RULES=require(require('path').resolve(process.argv[2],'rules.json'));
const DOM_N=+(process.argv[3]||400), URL=process.argv[4]||'http://127.0.0.1:8123/index.html';
(async()=>{
  const b=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined});
  const p=await b.newPage({viewport:{width:1280,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(URL); await p.waitForFunction(()=>window.MatrixReading&&window.MatrixReport);
  const res=await p.evaluate(({ORA,RULES,DOM_N})=>{
    const fail={}, ex={}, cnt={};
    const bad=(k,msg)=>{fail[k]=(fail[k]||0)+1; (ex[k]=ex[k]||[]).length<4&&ex[k].push(msg);};
    const ok=k=>cnt[k]=(cnt[k]||0)+1;
    const chk=(k,a,b,msg)=>{ if(a===b) ok(k); else bad(k,`${msg}: web=${a} esperado=${b}`); };
    // Referencia independiente (no reutiliza funciones de la página)
    const r=n=>{while(n>22)n=String(n).split('').reduce((s,d)=>s+ +d,0);return n;};
    const sub=(a,c)=>{const m=r(a+c),q1=r(a+m),q2=r(m+c);return [a,r(a+q1),q1,r(q1+m),m,r(m+q2),q2,r(q2+c),c];};
    const PER=["A","F","B","G","C","Y","D","K"];
    const perim=o=>{const n=[];for(let i=0;i<8;i++){const s=sub(o[PER[i]],o[PER[(i+1)%8]]);n.push(...s.slice(0,8));}return n;}; // 64 nodos: edad = idx·1.25
    const prop=o=>{const cielo=r(o.B+o.D),tierra=r(o.A+o.C),personal=r(cielo+tierra),masc=r(o.F+o.Y),fem=r(o.G+o.K),social=r(masc+fem),espiritual=r(personal+social);return {cielo,tierra,personal,masc,fem,social,espiritual,planetario:r(espiritual+social)};};
    const chak=o=>{const F=[o.A,o.A1,o.A2,o.A3,o.E,o.C1,o.C],En=[o.B,o.B1,o.B2,o.B3,o.E,o.D1,o.D];
      const rows=F.map((f,i)=>{const em=r(f+En[i]);return {fis:f,ene:En[i],emo:em,con:r(f+En[i]+em)};});
      const s=a=>r(a.reduce((x,y)=>x+y,0)); return {rows,tF:s(F),tE:s(En),tM:s(rows.map(x=>x.emo))};};
    const COLAS=new Set(RULES.col.map(c=>c[1]));
    const GEN=RULES.rules.filter(x=>x.cat!=="COMPATIBILIDAD");
    const PTS=Object.keys(ORA['26/04/2001']);
    const dates=Object.keys(ORA);
    // ---------- 1. Cálculo (todas las fechas) ----------
    dates.forEach(f=>{
      const [d,mo,y]=f.split('/').map(Number), o=ORA[f];
      const m=computeMatrix(d,mo,y), E=MatrixReading.points(d,mo,y);
      PTS.forEach(P=>{chk('puntos · carta (computeMatrix)',m.pts[P],o[P],`${f} ${P}`); chk('puntos · motor de lectura',E.p[P],o[P],`${f} ${P}`);});
      const pr=prop(o);
      [["cielo","cielo"],["tierra","tierra"],["personal","personal"],["hombre","masc"],["mujer","fem"],["social","social"],["espiritual","espiritual"],["planetario","planetario"]]
        .forEach(([a,k])=>{chk('propósitos · página',m[a],pr[k],`${f} ${k}`); chk('propósitos · motor',E.prop[k],pr[k],`${f} ${k}`);});
      const h=chakraValues(m), hc=chak(o);
      h.rows.forEach((x,i)=>['fis','ene','emo','con'].forEach(k=>chk('chakras · filas',x[k],hc.rows[i][k],`${f} fila ${i} ${k}`)));
      chk('chakras · totales',[h.totFis,h.totEne,h.totEmo].join(),[hc.tF,hc.tE,hc.tM].join(),f);
      // perímetro de la página (subdivide global) vs referencia
      const per=perim(o); const RING=["W","NW","N","NE","E","SE","S","SW"];
      const web=[]; for(let i=0;i<8;i++) web.push(...subdivide(m[RING[i]],m[RING[(i+1)%8]]).slice(0,8));
      chk('ciclos · 64 nodos del perímetro',web.join(),per.join(),f);
    });
    // ---------- 2. Motor: cola, programas, repeticiones, ciclo (todas las fechas) ----------
    const ZSEQ={}; GEN.forEach(x=>ZSEQ[x.zona]=x.seq);
    dates.forEach(f=>{
      const [d,mo,y]=f.split('/').map(Number), o=ORA[f];
      const R=MatrixReading.compute(d,mo,y,new Date(2026,8,22));
      const code=`${o.D1}-${o.D2}-${o.D}`;
      chk('cola · código D1-D2-D',R.cola.code,code,f);
      chk('cola · pertenece al catálogo de 26',!!R.cola.col,COLAS.has(code),f+' '+code);
      // programas esperados según 08_PROGRAMA_ZONA
      const exp=new Set();
      GEN.forEach(x=>{const v=x.seq.map(P=>o[P]); const c3=v.join('-'), pairs=[v[0]+'-'+v[1],v[1]+'-'+v[2]];
        const hit=x.adj?pairs.includes(x.code):x.code===c3; if(!hit) return;
        if(x.zona==="COLA_KARMICA"&&COLAS.has(x.code)) return;   // en D1-D2-D se lee como Cola canónica
        exp.add(x.zona+':'+x.code);});
      const got=new Set(R.programs.map(g=>g.seqId+':'+g.code));
      chk('programas · activación por zona',[...got].sort().join(' | '),[...exp].sort().join(' | '),f);
      // repeticiones (≥2 apariciones en los 32 puntos)
      const c={}; PTS.forEach(P=>c[o[P]]=(c[o[P]]||0)+1);
      const er=Object.entries(c).filter(([a,n])=>n>=2).map(([a,n])=>a+'×'+n).sort().join();
      chk('repeticiones',R.reps.map(x=>x.a+'×'+x.count).sort().join(),er,f);
      // ciclo activo: en cumpleaños exactos y a mitad de tramo
      const per=perim(o);
      for(const age of [0,5,10,25,33,47.5,61.25,79]){
        const yy=Math.floor(age), frac=age-yy, t=new Date(y+yy,mo-1,d); if(frac) t.setTime(t.getTime()+frac*365*864e5+864e5);
        const Rc=MatrixReading.compute(d,mo,y,t).cycle, idx=Math.floor(age/1.25);
        chk('ciclo activo (motor)',Rc.a,per[idx%64],`${f} edad ${age}`);
      }
    });
    // ---------- 3. Pantalla (DOM) y PDF en una muestra ----------
    const pos=(ang,rad)=>{const a=ang*Math.PI/180;return [rad*Math.cos(a),-rad*Math.sin(a)];};
    const Rr=210, key=(x,y)=>Math.round(x)+','+Math.round(y);
    const step=Math.max(1,Math.floor(dates.length/DOM_N));
    for(let i=0;i<dates.length;i+=step){
      const f=dates[i], [d,mo,y]=f.split('/').map(Number), o=ORA[f], pr=prop(o);
      document.getElementById('d').value=d; document.getElementById('m').value=mo; document.getElementById('y').value=y;
      syncCalFromParts(); calc(false);
      // nodos de la carta por posición
      const nodes={}; document.querySelectorAll('#matrix g').forEach(g=>{const c=g.querySelector('circle'),t=g.querySelector('text'); if(c&&t) nodes[key(+c.getAttribute('cx'),+c.getAttribute('cy'))]=+t.textContent;});
      const E=[["C",0],["G",45],["B",90],["F",135],["A",180],["K",225],["D",270],["Y",315]];
      const expN={}; E.forEach(([P,a])=>expN[key(...pos(a,Rr))]=[P,o[P]]);
      [["B1",90,.83],["B2",90,.68],["B3",90,.33],["A1",180,.83],["A2",180,.68],["A3",180,.33],["C2",0,.83],["C1",0,.68],["D2",270,.83],["D1",270,.68],
       ["S1",135,.70],["S2",135,.82],["P1",45,.70],["P2",45,.82],["P3",225,.70],["P4",225,.82],["S3",315,.70],["S4",315,.82],["X",315,.37],["E1",0,.19],["E2",0,.33]]
        .forEach(([P,a,k])=>expN[key(...pos(a,Rr*k))]=[P,o[P]]);
      expN[key(0,0)]=["E",o.E]; expN[key(Rr*.45,Rr*.22)]=["X1",o.X1]; expN[key(Rr*.25,Rr*.42)]=["X2",o.X2];
      expN[key(0,-Rr-98)]=["planetario",pr.planetario]; expN[key(0,Rr+98)]=["espiritual",pr.espiritual];
      [["F",127,1.37],["Y",144,1.37],["masc",135,1.2],["cielo",53,1.37],["tierra",37,1.37],["personal",45,1.2],["G",233,1.37],["K",217,1.37],["fem",225,1.2],["masc",307,1.37],["fem",323,1.37],["social",315,1.2]]
        .forEach(([P,a,k])=>expN[key(...pos(a,Rr*k))]=[P,P in o?o[P]:pr[P]]);
      Object.entries(expN).forEach(([k,[P,v]])=>chk('carta · 50 círculos',nodes[k],v,`${f} ${P}`));
      chk('carta · sin círculos de más',Object.keys(nodes).length,Object.keys(expN).length,f);
      // etiquetas del perímetro (56 intermedias)
      const per=perim(o), vs=[...document.querySelectorAll('#matrix text')].filter(t=>/^(13|11)$/.test(t.getAttribute('font-size'))&&!t.closest('g')&&/^\d+$/.test(t.textContent)).map(t=>+t.textContent);
      const expP=[]; for(let e=0;e<8;e++) for(let j=1;j<=7;j++) expP.push(per[e*8+j]);
      chk('carta · 56 etiquetas del perímetro',vs.join(),expP.join(),f);
      // tarjeta destacada, energías principales, salud, propósitos
      const tx=id=>document.getElementById(id).textContent.trim();
      chk('tarjeta destacada',[tx('featNum'),tx('fMision'),tx('fPersonal'),tx('fEspiritual')].join(),[o.E,pr.planetario,pr.personal,pr.espiritual].join(),f);
      chk('energías principales',[...document.querySelectorAll('#mainRows .num')].map(x=>x.textContent).join(),[o.E,o.A,o.B,o.C,o.D,o.F,o.G,o.Y,o.K].join(),f);
      const hc=chak(o), cells=[...document.querySelectorAll('#health tbody tr')].map(tr=>[...tr.querySelectorAll('td')].slice(1).map(td=>td.textContent).join('/'));
      chk('tabla de salud (pantalla)',cells.join(' '),hc.rows.map(x=>[x.fis,x.ene,x.emo,x.con].join('/')).join(' '),f);
      chk('tabla de salud · total',[...document.querySelectorAll('#healthTotal td')].slice(1,4).map(x=>x.textContent).join(),[hc.tF,hc.tE,hc.tM].join(),f);
      chk('propósitos (pantalla)',[...document.querySelectorAll('#purposes .res')].map(x=>x.textContent).join(),[pr.personal,pr.social,pr.espiritual,pr.planetario].join(),f);
      chk('propósitos · entradas (pantalla)',[...document.querySelectorAll('#purposes .chip .v')].map(x=>x.textContent).join(),[pr.cielo,pr.tierra,pr.masc,pr.fem,pr.personal,pr.social,pr.espiritual,pr.social].join(),f);
      // lectura profunda en pantalla
      const lec=PTS.map(P=>{const s=document.querySelector(`#rd-pt-${P} summary b`);return s?s.textContent:'—';}).join('|');
      const A=MatrixReading._lib.DATA.arc;
      chk('lectura profunda · 32 puntos',lec,PTS.map(P=>`${P} · ${A[o[P]].n}`).join('|'),f);
      // informe PDF: tabla de los 32 puntos y datos clave
      const Rr2=MatrixReading.compute(d,mo,y), S=MatrixReport.build(Rr2,{name:'',birth:'',issued:'',center:''});
      const mir=S.find(s=>s.id==='mirada'), t32=mir.blocks.filter(x=>x.t==='table')[1].rows;
      chk('informe PDF · 32 puntos',t32.map(r=>r[0]+'='+parseInt(r[1])).sort().join(),PTS.map(P=>P+'='+o[P]).sort().join(),f);
      const key6=mir.blocks.filter(x=>x.t==='table')[0].rows;
      chk('informe PDF · propósitos',key6[4][1],`Personal ${pr.personal} · Social ${pr.social} · Espiritual ${pr.espiritual} · Planetario ${pr.planetario}`,f);
      chk('informe PDF · centro y cola',key6[0][1].split(' ')[0]+' '+key6[1][1].split(' ')[0],`${o.E} ${o.D1}-${o.D2}-${o.D}`,f);
    }
    return {fail,ex,cnt,n:dates.length};
  },{ORA,RULES,DOM_N});
  console.log(`Fechas del oráculo: ${res.n}`);
  const keys=[...new Set([...Object.keys(res.cnt),...Object.keys(res.fail)])];
  for(const k of keys) console.log(`${res.fail[k]?'✗':'✓'} ${k}: ${res.cnt[k]||0} coinciden${res.fail[k]?`, ${res.fail[k]} NO — ej: ${res.ex[k].join(' ; ')}`:''}`);
  console.log('errores de página:',errs);
  await b.close();
})();
