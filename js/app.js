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

/* ----------------------- Biblioteca / búsqueda ----------------------- */
function totalLecciones(){
  return MODULOS.reduce((n,m)=> n + m.lecciones.length, 0);
}
function stripHtml(html){
  return String(html).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
}
function buscarLecciones(term){
  const t = String(term||"").toLowerCase().trim();
  const out = [];
  MODULOS.forEach(mod=>{
    mod.lecciones.forEach((lec,i)=>{
      const hay = (mod.titulo + " " + lec.titulo + " " + stripHtml(lec.html)).toLowerCase();
      if (!t || hay.includes(t)) out.push({ mod, idx:i, lec });
    });
  });
  return out;
}
function resaltarTexto(texto, term){
  if (!term) return esc(texto);
  const re = new RegExp("("+term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi");
  return esc(texto).replace(re,"<mark>$1</mark>");
}
function indiceLeccion(modId, idx){
  let n = 0;
  for (const m of MODULOS){
    if (m.id === modId) return n + idx + 1;
    n += m.lecciones.length;
  }
  return idx + 1;
}

/* ----------------------- Documentos PDF ----------------------- */
function buscarDocumentos(term, fuente){
  const t = String(term||"").toLowerCase().trim();
  const f = fuente || "todos";
  return DOCUMENTOS.filter(doc=>{
    if (f !== "todos" && doc.fuente !== f) return false;
    const hay = (doc.titulo + " " + doc.fuente + " " + doc.capacitador + " " + doc.tags.join(" ")).toLowerCase();
    return !t || hay.includes(t);
  });
}
function htmlTarjetaDocumento(doc){
  const modLabels = (doc.modulos||[]).map(id=>{
    const m = MODULOS.find(x=>x.id===id);
    return m ? m.icono + " " + m.id.toUpperCase() : id;
  }).join(" · ");
  const url = esc(doc.archivo);
  const fname = doc.archivo.split("/").pop();
  return `<article class="doc-card">
    <div class="doc-icon">📄</div>
    <div class="doc-body">
      <h3>${esc(doc.titulo)}</h3>
      <p class="doc-meta"><strong>${esc(doc.fuente)}</strong> · ${esc(doc.capacitador)} · ${esc(doc.fecha)}${doc.paginas?` · ${doc.paginas} págs.`:""}</p>
      ${modLabels ? `<p class="doc-mods">${modLabels}</p>` : ""}
      <div class="doc-tags">${doc.tags.map(t=>`<span class="tag-chip tag-static">${esc(t)}</span>`).join("")}</div>
    </div>
    <div class="doc-actions">
      <a class="btn btn-primary" href="${url}" target="_blank" rel="noopener noreferrer">👁️ Abrir PDF</a>
      <a class="btn btn-ghost" href="${url}" download="${esc(fname)}">⬇️ Descargar</a>
    </div>
  </article>`;
}
function htmlGrupoDocumentos(docs, titulo){
  if (!docs.length) return "";
  return `<div class="doc-group"><h3>${esc(titulo)} <span class="pill pill-soft">${docs.length}</span></h3><div class="doc-grid">${docs.map(htmlTarjetaDocumento).join("")}</div></div>`;
}
function renderDocumentosEnContenedor(container, term, fuente){
  if (!container) return;
  const docs = buscarDocumentos(term, fuente);
  const aeon = docs.filter(d=>d.fuente==="AEON Consulting");
  const cal = docs.filter(d=>d.fuente==="Calidad Consultora");
  container.innerHTML = docs.length
    ? htmlGrupoDocumentos(aeon, "AEON Consulting — Técnicas de Auditoría OEA 2025")
      + htmlGrupoDocumentos(cal, "Calidad Consultora — Formación Auditores 2026")
    : `<p class="muted bib-empty">No hay documentos que coincidan con la búsqueda.</p>`;
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
    <p class="muted">Tu progreso se guarda automáticamente en este equipo. Consulta libremente los <strong>${totalLecciones()} capítulos</strong> desde la biblioteca. Para obtener el diploma debes ver todo el contenido y aprobar las evaluaciones con un mínimo del <strong>${Math.round(CONFIG.umbralAprobacion*100)}%</strong>.</p>
    <div class="auditor-grid">${tarjetas}</div>
  </section>
  <section class="card info-curso">
    <h3>¿Qué incluye el curso?</h3>
    <p class="muted">${MODULOS.length} módulos · ${totalLecciones()} capítulos · ${DOCUMENTOS.length} documentos PDF descargables (AEON + Calidad Consultora)</p>
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
    let estadoTxt = compl ? `<span class="pill pill-ok">Completado · ${mejor}%</span>`
      : aprobado ? `<span class="pill pill-warn">Evaluación OK · falta contenido</span>`
      : `<span class="pill">En progreso · ${leidas}/${total} lecciones</span>`;
    return `<button class="mod-card ${compl?'mc-done':''}" data-mod="${m.id}">
      <div class="mc-top"><span class="mc-icon">${m.icono}</span>${compl?'<span class="mc-check">✓</span>':''}</div>
      <h3>${esc(m.titulo)}</h3>
      <p class="mc-res">${esc(m.resumen)}</p>
      <div class="mc-foot">${estadoTxt}<span class="pill pill-soft">${total} capítulos</span></div>
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
      <div class="head-actions">
        <button class="btn btn-primary" id="btnBiblioteca">📚 Biblioteca · ${totalLecciones()} capítulos</button>
        <button class="btn btn-green" id="btnDocumentos">📄 Documentos PDF · ${DOCUMENTOS.length}</button>
        ${diploma}
      </div>
    </div>
    <p class="muted">Todos los capítulos están disponibles para consulta libre. Para el diploma debes <strong>leer todo el contenido</strong> y <strong>aprobar las evaluaciones</strong> (${CONFIG.preguntasPorQuiz} preguntas, mínimo ${Math.round(CONFIG.umbralAprobacion*100)}%).</p>
    <div class="mod-grid">${tarjetas}</div>
  </section>`;

  document.querySelectorAll(".mod-card").forEach(b=>{
    b.addEventListener("click",()=> vistaModulo(b.dataset.mod));
  });
  const bb = $("#btnBiblioteca");
  if (bb) bb.addEventListener("click", vistaBiblioteca);
  const bd2 = $("#btnDocumentos");
  if (bd2) bd2.addEventListener("click", vistaDocumentos);
  const bd = $("#btnDiploma");
  if (bd && !bd.disabled) bd.addEventListener("click", vistaDiploma);
}

/* ----------------------- Vista: Biblioteca ----------------------- */
function vistaBiblioteca(termInicial){
  setTopbar();
  const est = estadoAuditor(auditorActual);
  let term = termInicial || "";
  const renderLista = ()=>{
    const items = buscarLecciones(term);
    const agrupado = {};
    items.forEach(it=>{
      if (!agrupado[it.mod.id]) agrupado[it.mod.id] = { mod:it.mod, lecciones:[] };
      agrupado[it.mod.id].lecciones.push(it);
    });
    const bloques = Object.values(agrupado).map(g=>{
      const filas = g.lecciones.map(({mod, idx, lec})=>{
        const key = `${mod.id}_${idx}`;
        const leida = !!est.lecciones[key];
        const num = indiceLeccion(mod.id, idx);
        return `<button class="bib-row ${leida?'bib-done':''}" data-mod="${mod.id}" data-lec="${idx}">
          <span class="bib-num">${leida?'✓':num}</span>
          <span class="bib-body">
            <strong>${resaltarTexto(lec.titulo, term)}</strong>
            <small>${esc(mod.titulo)}</small>
          </span>
          <span class="bib-go">›</span>
        </button>`;
      }).join("");
      return `<div class="bib-mod">
        <div class="bib-mod-head"><span>${g.mod.icono}</span><strong>${esc(g.mod.titulo)}</strong><span class="pill pill-soft">${g.lecciones.length}</span></div>
        <div class="bib-list">${filas}</div>
      </div>`;
    }).join("");

    $("#bibResultados").innerHTML = items.length
      ? bloques
      : `<p class="muted bib-empty">No se encontraron capítulos para «${esc(term)}». Prueba con «ISO 19011», «sellos», «asociados» o «PHVA».</p>`;
    $("#bibCount").textContent = `${items.length} de ${totalLecciones()} capítulos`;

    document.querySelectorAll(".bib-row").forEach(b=>{
      b.addEventListener("click",()=> vistaLeccion(b.dataset.mod, parseInt(b.dataset.lec,10), "bib"));
    });
  };

  $("#app").innerHTML = `
  <button class="btn btn-ghost btn-back" id="volver">‹ Volver al panel</button>
  <section class="card bib-hero">
    <h1>📚 Biblioteca de formación OEA</h1>
    <p class="muted">Consulta libre de los <strong>${totalLecciones()} capítulos</strong> integrados de AEON Consulting, Calidad Consultora (ISO 19011) y contenido OEA. Usa la búsqueda para localizar temas específicos.</p>
    <div class="bib-search-wrap">
      <input type="search" class="bib-search" id="bibSearch" placeholder="Buscar: ISO 19011, 7 puntos, ketamina, PHVA, hallazgos…" value="${esc(term)}" autocomplete="off">
      <span class="bib-count" id="bibCount"></span>
    </div>
    <div class="bib-tags">
      ${["ISO 19011","ISO 9001","OEA","7 puntos","sellos","asociados","PHVA","hallazgos","simulacro","C-TPAT","riesgo"].map(t=>
        `<button type="button" class="tag-chip" data-tag="${esc(t)}">${esc(t)}</button>`).join("")}
      <button type="button" class="tag-chip tag-chip-docs" id="bibToDocs">📄 Ver PDFs originales</button>
    </div>
  </section>
  <section class="card">
    <div id="bibResultados"></div>
  </section>`;

  $("#volver").addEventListener("click", vistaDashboard);
  const inp = $("#bibSearch");
  inp.addEventListener("input", ()=>{ term = inp.value; renderLista(); });
  document.querySelectorAll(".tag-chip").forEach(chip=>{
    if (chip.id === "bibToDocs") return;
    chip.addEventListener("click",()=>{ term = chip.dataset.tag; inp.value = term; renderLista(); inp.focus(); });
  });
  const btd = $("#bibToDocs");
  if (btd) btd.addEventListener("click", ()=> vistaDocumentos(term));
  renderLista();
  window.scrollTo(0,0);
}

/* ----------------------- Vista: Documentos PDF ----------------------- */
function vistaDocumentos(termInicial, fuenteInicial){
  setTopbar();
  let term = termInicial || "";
  let fuente = fuenteInicial || "todos";

  const render = ()=>{
    const cont = $("#docResultados");
    renderDocumentosEnContenedor(cont, term, fuente);
    const n = buscarDocumentos(term, fuente).length;
    $("#docCount").textContent = `${n} de ${DOCUMENTOS.length} documentos`;
  };

  $("#app").innerHTML = `
  <button class="btn btn-ghost btn-back" id="volver">‹ Volver al panel</button>
  <section class="card bib-hero">
    <h1>📄 Documentos PDF de formación</h1>
    <p class="muted">Memorias y presentaciones originales de <strong>AEON Consulting</strong> (julio 2025) y <strong>Calidad Consultora</strong> (2026). Ábralos en el navegador o descárguelos para consulta offline.</p>
    <div class="bib-search-wrap">
      <input type="search" class="bib-search" id="docSearch" placeholder="Buscar por tema: ISO 9001, ketamina, FRIOFORT, hallazgos…" value="${esc(term)}" autocomplete="off">
      <span class="bib-count" id="docCount"></span>
    </div>
    <div class="doc-filters">
      <button type="button" class="tag-chip doc-filter ${fuente==='todos'?'tag-active':''}" data-fuente="todos">Todos</button>
      <button type="button" class="tag-chip doc-filter ${fuente==='AEON Consulting'?'tag-active':''}" data-fuente="AEON Consulting">AEON · OEA 2025</button>
      <button type="button" class="tag-chip doc-filter ${fuente==='Calidad Consultora'?'tag-active':''}" data-fuente="Calidad Consultora">Calidad · 2026</button>
    </div>
  </section>
  <section class="card"><div id="docResultados"></div></section>`;

  $("#volver").addEventListener("click", vistaDashboard);
  const inp = $("#docSearch");
  inp.addEventListener("input", ()=>{ term = inp.value; render(); });
  document.querySelectorAll(".doc-filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
      fuente = btn.dataset.fuente;
      document.querySelectorAll(".doc-filter").forEach(b=>b.classList.toggle("tag-active", b.dataset.fuente===fuente));
      render();
    });
  });
  render();
  window.scrollTo(0,0);
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
    b.addEventListener("click",()=> vistaLeccion(modId, parseInt(b.dataset.lec,10), "mod"));
  });
  const be = $("#btnEval");
  if (be && !be.disabled) be.addEventListener("click",()=> iniciarQuiz(modId));
}

/* ----------------------- Vista: Lección ----------------------- */
function vistaLeccion(modId, idx, origen){
  const mod = MODULOS.find(m=>m.id===modId);
  const lec = mod.lecciones[idx];
  const est = estadoAuditor(auditorActual);
  est.lecciones[`${modId}_${idx}`] = true;
  guardarDB();
  setTopbar();

  const hayPrev = idx>0;
  const hayNext = idx < mod.lecciones.length-1;
  const volverFn = origen === "bib" ? vistaBiblioteca : ()=> vistaModulo(modId);
  const volverTxt = origen === "bib" ? "‹ Volver a biblioteca" : "‹ Volver al módulo";

  const miniIndice = mod.lecciones.map((l,i)=>`
    <button class="lec-pill ${i===idx?'lp-active':''} ${est.lecciones[`${modId}_${i}`]?'lp-done':''}" data-lec="${i}" title="${esc(l.titulo)}">
      ${est.lecciones[`${modId}_${i}`]?'✓':i+1}
    </button>`).join("");

  $("#app").innerHTML = `
  <button class="btn btn-ghost btn-back" id="volver">${volverTxt}</button>
  <article class="card leccion">
    <div class="lec-meta">
      <div class="lec-crumb">${esc(mod.titulo)} · Capítulo ${idx+1}/${mod.lecciones.length} · #${indiceLeccion(modId,idx)} global</div>
      <button class="btn btn-ghost btn-sm" id="btnBibQuick">📚 Índice general</button>
    </div>
    <h1>${esc(lec.titulo)}</h1>
    <div class="lec-pills">${miniIndice}</div>
    <div class="lec-body">${lec.html}</div>
    <div class="lec-nav">
      <button class="btn btn-ghost" id="prev" ${hayPrev?'':'disabled'}>‹ Anterior</button>
      <span class="lec-count">Lección ${idx+1} de ${mod.lecciones.length}</span>
      ${hayNext
        ? `<button class="btn btn-primary" id="next">Siguiente ›</button>`
        : `<button class="btn btn-primary" id="next">Terminar contenido ✓</button>`}
    </div>
  </article>`;

  $("#volver").addEventListener("click", volverFn);
  $("#btnBibQuick").addEventListener("click", vistaBiblioteca);
  document.querySelectorAll(".lec-pill").forEach(p=>{
    p.addEventListener("click",()=> vistaLeccion(modId, parseInt(p.dataset.lec,10), origen));
  });
  const p = $("#prev"); if (p && !p.disabled) p.addEventListener("click",()=> vistaLeccion(modId, idx-1, origen));
  $("#next").addEventListener("click",()=> hayNext ? vistaLeccion(modId, idx+1, origen) : volverFn());
  const docEmbed = $("#lec-docs-embed");
  if (docEmbed) renderDocumentosEnContenedor(docEmbed, "", "todos");
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
aplicarTema(temaActual());
if (typeof CONFIG !== "undefined" && CONFIG.version) {
  const fv = document.getElementById("footerVer");
  if (fv) fv.textContent = "v" + CONFIG.version;
}
vistaLogin();
