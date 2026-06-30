/* =====================================================================
   app.js — Lógica de la Plataforma de Formación OEA
   100% cliente (HTML/CSS/JS). Persistencia: localStorage.
   ===================================================================== */
"use strict";

/* ----------------------- Estado y persistencia ----------------------- */
const STORE_KEY = "oea_progreso_v1";
let DB = cargarDB();           // { auditores: { id: estado } }
let auditorActual = null;      // id del auditor en sesión
let quiz = null;               // estado del quiz en curso

function cargarDB() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn("No se pudo leer el progreso:", e); }
  return { auditores: {} };
}
function guardarDB() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }
  catch (e) { console.warn("No se pudo guardar el progreso:", e); }
}
function estadoAuditor(id) {
  if (!DB.auditores[id]) {
    DB.auditores[id] = { lecciones: {}, modulos: {}, inicio: hoyISO() };
    guardarDB();
  }
  return DB.auditores[id];
}

/* ----------------------- Utilidades ----------------------- */
function hoyISO() { return new Date().toISOString().slice(0, 10); }
function fechaLarga() {
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const d = new Date();
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* PRNG determinista (mulberry32) sembrado por cadena — para que cada
   auditor reciba un subconjunto distinto y se minimice la repetición. */
function hashCadena(str){
  let h = 1779033703 ^ str.length;
  for (let i=0;i<str.length;i++){
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h>>>16)) >>> 0;
}
function mulberry32(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function barajar(arr, rnd){
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--){
    const j = Math.floor(rnd()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ----------------------- Cálculo de progreso ----------------------- */
function leccionesDelModulo(mod){ return mod.lecciones.length; }
function leccionesLeidas(estado, modId){
  const mod = MODULOS.find(m=>m.id===modId);
  let n=0;
  for (let i=0;i<mod.lecciones.length;i++) if (estado.lecciones[`${modId}_${i}`]) n++;
  return n;
}
function todasLeccionesLeidas(estado, modId){
  const mod = MODULOS.find(m=>m.id===modId);
  return leccionesLeidas(estado, modId) === mod.lecciones.length;
}
function moduloAprobado(estado, modId){
  const m = estado.modulos[modId];
  return !!(m && m.aprobado);
}
function moduloCompleto(estado, modId){
  return todasLeccionesLeidas(estado, modId) && moduloAprobado(estado, modId);
}
function progresoGlobal(estado){
  // Promedio de los mejores puntajes de los módulos aprobados / total módulos
  let suma=0;
  MODULOS.forEach(m=>{
    const e = estado.modulos[m.id];
    if (e && typeof e.mejor === "number") suma += e.mejor;
  });
  return suma / MODULOS.length; // 0..1
}
function cursoCompleto(estado){
  return MODULOS.every(m => moduloCompleto(estado, m.id));
}

/* ===================================================================
   ENRUTADOR / RENDER
   =================================================================== */
function render(){
  if (!auditorActual){ vistaLogin(); return; }
}
function setTopbar(){
  const tb = $("#topbarUser");
  if (!auditorActual){ tb.hidden = true; return; }
  const aud = AUDITORES.find(a=>a.id===auditorActual);
  const est = estadoAuditor(auditorActual);
  tb.hidden = false;
  $("#userName").textContent = aud.nombre;
  $("#userRole").textContent = aud.cargo;
  const pct = Math.round(progresoGlobal(est)*100);
  $("#globalBar").style.width = pct + "%";
  $("#globalPct").textContent = pct + "%";
}

/* ----------------------- Vista: Login ----------------------- */
function vistaLogin(){
  auditorActual = null;
  setTopbar();
  const tarjetas = AUDITORES.map(a=>{
    const est = DB.auditores[a.id];
    const pct = est ? Math.round(progresoGlobal(est)*100) : 0;
    const completo = est && cursoCompleto(est);
    return `<button class="auditor-card" data-aud="${a.id}">
      <span class="avatar">${esc(iniciales(a.nombre))}</span>
      <span class="ac-info">
        <strong>${esc(a.nombre)}</strong>
        <small>${esc(a.cargo)}</small>
      </span>
      <span class="ac-prog ${completo?'done':''}">${completo?'✓ Certificado':pct+'%'}</span>
    </button>`;
  }).join("");

  $("#app").innerHTML = `
  <section class="hero">
    <h1>Plataforma de Formación</h1>
    <p class="hero-sub">${esc(CONFIG.cursoNombre)}</p>
    <p class="hero-empresa">${esc(CONFIG.empresa)}</p>
  </section>
  <section class="card">
    <h2>Selecciona tu nombre de Auditor Interno</h2>
    <p class="muted">Tu progreso se guarda automáticamente en este equipo. Para obtener el diploma debes ver todo el contenido y aprobar las evaluaciones con un mínimo del <strong>${Math.round(CONFIG.umbralAprobacion*100)}%</strong>.</p>
    <div class="auditor-grid">${tarjetas}</div>
  </section>
  <section class="card info-curso">
    <h3>¿Qué incluye el curso?</h3>
    <div class="modgrid-mini">
      ${MODULOS.map(m=>`<div class="mini-mod"><span>${m.icono}</span><div><strong>${esc(m.titulo)}</strong></div></div>`).join("")}
    </div>
  </section>`;

  document.querySelectorAll(".auditor-card").forEach(btn=>{
    btn.addEventListener("click",()=>{
      auditorActual = btn.dataset.aud;
      estadoAuditor(auditorActual);
      vistaDashboard();
    });
  });
}
function iniciales(nombre){
  return nombre.split(" ").filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join("");
}

/* ----------------------- Vista: Dashboard ----------------------- */
function vistaDashboard(){
  setTopbar();
  const est = estadoAuditor(auditorActual);
  const aud = AUDITORES.find(a=>a.id===auditorActual);
  const completo = cursoCompleto(est);
  const pctGlobal = Math.round(progresoGlobal(est)*100);

  const tarjetas = MODULOS.map((m,idx)=>{
    const leidas = leccionesLeidas(est, m.id);
    const total = leccionesDelModulo(m);
    const aprobado = moduloAprobado(est, m.id);
    const compl = moduloCompleto(est, m.id);
    const datos = est.modulos[m.id];
    const mejor = datos && typeof datos.mejor==="number" ? Math.round(datos.mejor*100) : null;
    const bloqueado = idx>0 && !moduloCompleto(est, MODULOS[idx-1].id);
    let estadoTxt = compl ? `<span class="pill pill-ok">Completado · ${mejor}%</span>`
      : aprobado ? `<span class="pill pill-warn">Evaluación OK · falta contenido</span>`
      : bloqueado ? `<span class="pill pill-lock">🔒 Completa el módulo anterior</span>`
      : `<span class="pill">En progreso · ${leidas}/${total} lecciones</span>`;
    return `<button class="mod-card ${compl?'mc-done':''} ${bloqueado?'mc-lock':''}" data-mod="${m.id}" ${bloqueado?'disabled':''}>
      <div class="mc-top"><span class="mc-icon">${m.icono}</span>${compl?'<span class="mc-check">✓</span>':''}</div>
      <h3>${esc(m.titulo)}</h3>
      <p class="mc-res">${esc(m.resumen)}</p>
      <div class="mc-foot">${estadoTxt}</div>
    </button>`;
  }).join("");

  const diploma = completo
    ? `<button class="btn btn-gold btn-lg" id="btnDiploma">🎓 Ver / Descargar Diploma</button>`
    : `<button class="btn btn-lg" id="btnDiploma" disabled title="Completa todos los módulos">🎓 Diploma (bloqueado)</button>`;

  $("#app").innerHTML = `
  <section class="dash-head">
    <div>
      <h1>Hola, ${esc(aud.nombre.split(" ")[0])} 👋</h1>
      <p class="muted">${esc(aud.cargo)} · Avance global del curso</p>
    </div>
    <div class="dash-prog">
      <div class="ring" style="--p:${pctGlobal}">
        <span>${pctGlobal}%</span>
      </div>
    </div>
  </section>

  ${completo ? `<div class="banner-ok">🎉 ¡Felicitaciones! Has completado el 100% del curso con un puntaje global del <strong>${pctGlobal}%</strong>. Ya puedes generar tu diploma y enviarlo a <strong>Sistemas de Gestión</strong>.</div>` : ``}

  <section class="card">
    <div class="card-head">
      <h2>Módulos del curso</h2>
      ${diploma}
    </div>
    <p class="muted">Avanza en orden. Cada módulo requiere <strong>leer todo el contenido</strong> y <strong>aprobar la evaluación</strong> (${CONFIG.preguntasPorQuiz} preguntas, mínimo ${Math.round(CONFIG.umbralAprobacion*100)}%).</p>
    <div class="mod-grid">${tarjetas}</div>
  </section>`;

  document.querySelectorAll(".mod-card").forEach(b=>{
    if (!b.disabled) b.addEventListener("click",()=> vistaModulo(b.dataset.mod));
  });
  const bd = $("#btnDiploma");
  if (bd && !bd.disabled) bd.addEventListener("click", vistaDiploma);
}

/* ----------------------- Vista: Módulo ----------------------- */
function vistaModulo(modId){
  const mod = MODULOS.find(m=>m.id===modId);
  const est = estadoAuditor(auditorActual);
  const total = mod.lecciones.length;
  const leidas = leccionesLeidas(est, modId);
  const puedeEvaluar = todasLeccionesLeidas(est, modId);
  const datos = est.modulos[modId];
  const aprobado = moduloAprobado(est, modId);

  const lista = mod.lecciones.map((l,i)=>{
    const leida = !!est.lecciones[`${modId}_${i}`];
    return `<button class="leccion-row ${leida?'lr-done':''}" data-lec="${i}">
      <span class="lr-num">${leida?'✓':i+1}</span>
      <span class="lr-tit">${esc(l.titulo)}</span>
      <span class="lr-go">›</span>
    </button>`;
  }).join("");

  $("#app").innerHTML = `
  <button class="btn btn-ghost btn-back" id="volver">‹ Volver al panel</button>
  <section class="card">
    <div class="mod-hero"><span class="mc-icon big">${mod.icono}</span>
      <div><h1>${esc(mod.titulo)}</h1><p class="muted">${esc(mod.resumen)}</p></div>
    </div>
    <div class="mod-progress"><div class="mini-bar"><span style="width:${Math.round(leidas/total*100)}%"></span></div>
      <small>${leidas}/${total} lecciones leídas</small></div>

    <h2>Contenido</h2>
    <div class="leccion-list">${lista}</div>

    <div class="eval-box">
      ${aprobado ? `<p class="pill pill-ok">Evaluación aprobada · mejor puntaje ${Math.round(datos.mejor*100)}%</p>` : ``}
      <button class="btn btn-primary btn-lg" id="btnEval" ${puedeEvaluar?'':'disabled'}>
        ${aprobado ? 'Repetir evaluación' : 'Presentar evaluación'} (${CONFIG.preguntasPorQuiz} preguntas)
      </button>
      ${puedeEvaluar?'':`<p class="muted">📕 Debes leer todas las lecciones para habilitar la evaluación.</p>`}
    </div>
  </section>`;

  $("#volver").addEventListener("click", vistaDashboard);
  document.querySelectorAll(".leccion-row").forEach(b=>{
    b.addEventListener("click",()=> vistaLeccion(modId, parseInt(b.dataset.lec,10)));
  });
  const be = $("#btnEval");
  if (be && !be.disabled) be.addEventListener("click",()=> iniciarQuiz(modId));
}

/* ----------------------- Vista: Lección ----------------------- */
function vistaLeccion(modId, idx){
  const mod = MODULOS.find(m=>m.id===modId);
  const lec = mod.lecciones[idx];
  const est = estadoAuditor(auditorActual);
  // marcar como leída
  est.lecciones[`${modId}_${idx}`] = true;
  guardarDB();
  setTopbar();

  const hayPrev = idx>0;
  const hayNext = idx < mod.lecciones.length-1;

  $("#app").innerHTML = `
  <button class="btn btn-ghost btn-back" id="volver">‹ Volver al módulo</button>
  <article class="card leccion">
    <div class="lec-crumb">${esc(mod.titulo)}</div>
    <h1>${esc(lec.titulo)}</h1>
    <div class="lec-body">${lec.html}</div>
    <div class="lec-nav">
      <button class="btn btn-ghost" id="prev" ${hayPrev?'':'disabled'}>‹ Anterior</button>
      <span class="lec-count">Lección ${idx+1} de ${mod.lecciones.length}</span>
      ${hayNext
        ? `<button class="btn btn-primary" id="next">Siguiente ›</button>`
        : `<button class="btn btn-primary" id="next">Terminar contenido ✓</button>`}
    </div>
  </article>`;

  $("#volver").addEventListener("click",()=> vistaModulo(modId));
  const p = $("#prev"); if (p && !p.disabled) p.addEventListener("click",()=> vistaLeccion(modId, idx-1));
  $("#next").addEventListener("click",()=> hayNext ? vistaLeccion(modId, idx+1) : vistaModulo(modId));
  window.scrollTo(0,0);
}

/* ----------------------- Motor de Quiz ----------------------- */
function iniciarQuiz(modId){
  const est = estadoAuditor(auditorActual);
  const datos = est.modulos[modId] || { intentos:0 };
  const intento = (datos.intentos||0) + 1;

  // Pool del módulo
  const pool = PREGUNTAS.filter(p=>p.m===modId);
  // Semilla determinista: distinta por auditor, módulo e intento => minimiza repetición entre auditores
  const seed = hashCadena(`${auditorActual}|${modId}|${intento}`);
  const rnd = mulberry32(seed);
  const seleccion = barajar(pool, rnd).slice(0, Math.min(CONFIG.preguntasPorQuiz, pool.length));

  // Barajar también las opciones de cada pregunta
  const preguntas = seleccion.map(p=>{
    const idxs = barajar([0,1,2,3], rnd);
    const opciones = idxs.map(i=>p.op[i]);
    const correcta = idxs.indexOf(p.r);
    return { id:p.id, q:p.q, opciones, correcta, j:p.j };
  });

  quiz = { modId, intento, preguntas, actual:0, respuestas:Array(preguntas.length).fill(null) };
  vistaQuiz();
}

function vistaQuiz(){
  const mod = MODULOS.find(m=>m.id===quiz.modId);
  const i = quiz.actual;
  const p = quiz.preguntas[i];
  const sel = quiz.respuestas[i];
  const total = quiz.preguntas.length;

  const opciones = p.opciones.map((op,k)=>`
    <button class="opcion ${sel===k?'op-sel':''}" data-op="${k}">
      <span class="op-letra">${String.fromCharCode(65+k)}</span>
      <span>${esc(op)}</span>
    </button>`).join("");

  $("#app").innerHTML = `
  <section class="card quiz">
    <div class="quiz-head">
      <div><strong>Evaluación · ${esc(mod.titulo)}</strong><small class="muted"> · Intento ${quiz.intento}</small></div>
      <div class="quiz-count">${i+1} / ${total}</div>
    </div>
    <div class="mini-bar quiz-bar"><span style="width:${Math.round((i)/total*100)}%"></span></div>
    <h2 class="quiz-q">${esc(p.q)}</h2>
    <div class="opciones">${opciones}</div>
    <div class="quiz-nav">
      <button class="btn btn-ghost" id="qprev" ${i>0?'':'disabled'}>‹ Anterior</button>
      ${i<total-1
        ? `<button class="btn btn-primary" id="qnext">Siguiente ›</button>`
        : `<button class="btn btn-gold" id="qfin">Finalizar evaluación</button>`}
    </div>
    <p class="muted quiz-resp-info">${quiz.respuestas.filter(x=>x!==null).length} de ${total} respondidas</p>
  </section>`;

  document.querySelectorAll(".opcion").forEach(b=>{
    b.addEventListener("click",()=>{
      quiz.respuestas[i] = parseInt(b.dataset.op,10);
      vistaQuiz();
    });
  });
  const pv=$("#qprev"); if (pv && !pv.disabled) pv.addEventListener("click",()=>{ quiz.actual--; vistaQuiz(); });
  const nx=$("#qnext"); if (nx) nx.addEventListener("click",()=>{ quiz.actual++; vistaQuiz(); });
  const fn=$("#qfin"); if (fn) fn.addEventListener("click", finalizarQuiz);
  window.scrollTo(0,0);
}

function finalizarQuiz(){
  const total = quiz.preguntas.length;
  const sinResp = quiz.respuestas.filter(x=>x===null).length;
  if (sinResp>0){
    if (!confirm(`Tienes ${sinResp} pregunta(s) sin responder, que contarán como incorrectas. ¿Deseas finalizar de todas formas?`)) return;
  }
  let correctas=0;
  quiz.preguntas.forEach((p,i)=>{ if (quiz.respuestas[i]===p.correcta) correctas++; });
  const puntaje = correctas/total; // 0..1
  const aprobado = puntaje >= CONFIG.umbralAprobacion;

  // Persistir
  const est = estadoAuditor(auditorActual);
  const prev = est.modulos[quiz.modId] || { intentos:0, mejor:0, aprobado:false };
  est.modulos[quiz.modId] = {
    intentos: quiz.intento,
    ultimo: puntaje,
    mejor: Math.max(prev.mejor||0, puntaje),
    aprobado: prev.aprobado || aprobado,
    fecha: hoyISO()
  };
  guardarDB();
  setTopbar();
  vistaResultado(correctas, total, puntaje, aprobado);
}

function vistaResultado(correctas, total, puntaje, aprobado){
  const mod = MODULOS.find(m=>m.id===quiz.modId);
  const pct = Math.round(puntaje*100);
  const revision = quiz.preguntas.map((p,i)=>{
    const r = quiz.respuestas[i];
    const ok = r===p.correcta;
    return `<div class="rev ${ok?'rev-ok':'rev-bad'}">
      <div class="rev-q"><span>${ok?'✓':'✗'}</span> ${esc(p.q)}</div>
      <div class="rev-a">Tu respuesta: <strong>${r!==null?esc(p.opciones[r]):'(sin responder)'}</strong></div>
      ${ok?'':`<div class="rev-a rev-correct">Respuesta correcta: <strong>${esc(p.opciones[p.correcta])}</strong></div>`}
      <div class="rev-just">💡 ${esc(p.j)}</div>
    </div>`;
  }).join("");

  $("#app").innerHTML = `
  <section class="card resultado">
    <div class="res-top ${aprobado?'res-ok':'res-bad'}">
      <div class="res-emoji">${aprobado?'🎉':'📚'}</div>
      <h1>${aprobado?'¡Evaluación aprobada!':'No alcanzaste el mínimo'}</h1>
      <div class="res-score">${pct}%</div>
      <p>${correctas} de ${total} respuestas correctas · Mínimo requerido: ${Math.round(CONFIG.umbralAprobacion*100)}%</p>
    </div>
    <div class="res-actions">
      ${aprobado
        ? `<button class="btn btn-primary" id="resVolver">Continuar ›</button>`
        : `<button class="btn btn-gold" id="resRetry">Reintentar evaluación</button>
           <button class="btn btn-ghost" id="resVolver">Volver al módulo</button>`}
    </div>
    <h2>Revisión de respuestas</h2>
    <div class="revision">${revision}</div>
    <div class="res-actions">
      ${aprobado
        ? `<button class="btn btn-primary" id="resVolver2">Continuar ›</button>`
        : `<button class="btn btn-gold" id="resRetry2">Reintentar evaluación</button>`}
    </div>
  </section>`;

  const goModulo = ()=> vistaModulo(quiz.modId);
  const retry = ()=> iniciarQuiz(quiz.modId);
  ["resVolver","resVolver2"].forEach(id=>{ const b=$("#"+id); if(b) b.addEventListener("click", aprobado?vistaDashboard:goModulo); });
  ["resRetry","resRetry2"].forEach(id=>{ const b=$("#"+id); if(b) b.addEventListener("click", retry); });
  window.scrollTo(0,0);
}

/* ----------------------- Vista: Diploma ----------------------- */
function vistaDiploma(){
  const est = estadoAuditor(auditorActual);
  const aud = AUDITORES.find(a=>a.id===auditorActual);
  const pct = Math.round(progresoGlobal(est)*100);
  const codigo = generarCodigo(aud.id, est);

  const detalle = MODULOS.map(m=>{
    const d = est.modulos[m.id];
    return `<tr><td>${esc(m.titulo)}</td><td>${d?Math.round(d.mejor*100):0}%</td></tr>`;
  }).join("");

  $("#app").innerHTML = `
  <button class="btn btn-ghost btn-back no-print" id="volver">‹ Volver al panel</button>

  <div class="diploma" id="diploma">
    <div class="dip-border">
      <div class="dip-head">
        <div class="dip-logos">
          <img class="dip-logo" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigu_vafcG5saLG0r13cHA0Y9geRGVEjPESWbHTVt9fegBAIB6QsTVDelYSmoTSb69y912nYTf3ckJC6FeS1OcEyvDA_u3rJUlc3T02BzfssvNRrrLOESObIVaeI0SE3yW7GM4J2VqmB9zrDf6xsc3UyIESHks1sJ8OkxxgBxHinI48TTYsTLHSffvDWA/w200-h178/Logo-versi%C3%B3n-final-2022.png" alt="C.I. Colombian Mint S.A.S.">
          <img class="dip-logo" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4tQ1-DZRCCzhvzDy3ghx8AZ70LZg3QIRMN__VptBWEBOP2E6e-56LbFGLDOy06PoGYMxkoytMV_aG2Iw3jSbRxm_YbDzu2g3QGcz0x2FWIxtOS-OYr42tYQOEW0gstVN8UiOXHuwtihC83dXr8JQahY1m8t1-5ahYCya8iMTAyLzJrYahwFheYnFYfvbK/w200-h113/CAPTE%202.0%201.png" alt="Cultura CAPTE 2.0">
        </div>
        <div class="dip-empresa">${esc(CONFIG.empresa)}</div>
        <div class="dip-sub">Sistema de Gestión en Control y Seguridad</div>
      </div>
      <h1 class="dip-title">DIPLOMA DE FORMACIÓN</h1>
      <p class="dip-otorga">El presente certifica que</p>
      <h2 class="dip-nombre">${esc(aud.nombre)}</h2>
      <p class="dip-cargo">${esc(aud.cargo)}</p>
      <p class="dip-texto">ha culminado satisfactoriamente la formación interna</p>
      <h3 class="dip-curso">«${esc(CONFIG.cursoNombre)}»</h3>
      <p class="dip-texto">cumpliendo con la totalidad del contenido y aprobando las evaluaciones
      de los ${MODULOS.length} módulos con un puntaje global del <strong>${pct}%</strong>
      (mínimo exigido: ${Math.round(CONFIG.umbralAprobacion*100)}%).</p>

      <div class="dip-firmas">
        <div class="dip-firma"><span class="firma-nombre">Luis Arango</span><span class="firma-linea"></span><small>Sistemas de Gestión</small></div>
        <div class="dip-firma"><span class="firma-nombre">Estefanía Granda</span><span class="firma-linea"></span><small>Oficial de Cumplimiento</small></div>
      </div>

      <div class="dip-foot">
        <span>Fecha de expedición: ${fechaLarga()}</span>
        <span>Código de verificación: <strong>${codigo}</strong></span>
      </div>
    </div>
  </div>

  <section class="card no-print">
    <h2>Detalle de calificaciones por módulo</h2>
    <table class="tbl tbl-cal"><tr><th>Módulo</th><th>Mejor puntaje</th></tr>${detalle}
      <tr class="tbl-total"><td><strong>Puntaje global</strong></td><td><strong>${pct}%</strong></td></tr>
    </table>
    <div class="dip-actions">
      <button class="btn btn-gold btn-lg" id="imprimir">🖨️ Imprimir / Guardar como PDF</button>
      <button class="btn btn-primary" id="enviar">📧 Enviar a Sistemas de Gestión</button>
      <button class="btn btn-ghost" id="exportar">⬇️ Exportar constancia (.txt)</button>
    </div>
    <p class="muted">Para entregar la evidencia: usa "Imprimir / Guardar como PDF" y envía el archivo al área de Sistemas de Gestión, o utiliza el botón de correo.</p>
  </section>`;

  $("#volver").addEventListener("click", vistaDashboard);
  $("#imprimir").addEventListener("click", ()=> window.print());
  $("#exportar").addEventListener("click", ()=> exportarConstancia(aud, est, pct, codigo));
  $("#enviar").addEventListener("click", ()=> enviarCorreo(aud, pct, codigo));
  window.scrollTo(0,0);
}

function generarCodigo(id, est){
  const base = hashCadena(`${id}|${est.inicio}|${CONFIG.cursoNombre}`).toString(36).toUpperCase();
  return "OEA-" + base.slice(0,6).padStart(6,"0");
}
function exportarConstancia(aud, est, pct, codigo){
  let txt = `CONSTANCIA DE FORMACIÓN INTERNA\n${CONFIG.empresa}\n\n`;
  txt += `Curso: ${CONFIG.cursoNombre}\n`;
  txt += `Auditor: ${aud.nombre} (${aud.cargo})\n`;
  txt += `Puntaje global: ${pct}%  (mínimo exigido ${Math.round(CONFIG.umbralAprobacion*100)}%)\n`;
  txt += `Fecha: ${fechaLarga()}\nCódigo de verificación: ${codigo}\n\n`;
  txt += `Detalle por módulo:\n`;
  MODULOS.forEach(m=>{ const d=est.modulos[m.id]; txt += `  - ${m.titulo}: ${d?Math.round(d.mejor*100):0}%\n`; });
  const blob = new Blob([txt], {type:"text/plain;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Constancia_OEA_${aud.nombre.replace(/\s+/g,'_')}.txt`;
  a.click();
}
function enviarCorreo(aud, pct, codigo){
  const asunto = encodeURIComponent(`Constancia formación OEA — ${aud.nombre}`);
  const cuerpo = encodeURIComponent(
`Cordial saludo, área de Sistemas de Gestión:

Informo que he completado la formación interna "${CONFIG.cursoNombre}".

Auditor: ${aud.nombre} (${aud.cargo})
Puntaje global: ${pct}%
Código de verificación: ${codigo}
Fecha: ${fechaLarga()}

Adjunto el diploma en PDF para su archivo.

Cordialmente,
${aud.nombre}`);
  window.location.href = `mailto:?subject=${asunto}&body=${cuerpo}`;
}

/* ----------------------- Tema claro / oscuro ----------------------- */
function temaActual(){
  return document.documentElement.getAttribute("data-theme") || "claro";
}
function aplicarTema(t){
  document.documentElement.setAttribute("data-theme", t);
  try{ localStorage.setItem("oea_tema", t); }catch(e){}
  const b = document.getElementById("btnTema");
  if (b) b.textContent = (t === "oscuro") ? "☀️ Claro" : "🌙 Oscuro";
}
function alternarTema(){
  aplicarTema(temaActual() === "oscuro" ? "claro" : "oscuro");
}

/* ----------------------- Eventos globales ----------------------- */
document.getElementById("btnSalir").addEventListener("click", ()=>{
  if (confirm("¿Salir y elegir otro auditor? Tu progreso queda guardado.")) vistaLogin();
});
document.getElementById("btnTema").addEventListener("click", alternarTema);

/* ----------------------- Arranque ----------------------- */
aplicarTema(temaActual());   // sincroniza la etiqueta del botón con el tema guardado
vistaLogin();
