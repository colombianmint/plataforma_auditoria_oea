/* =====================================================================
   PLATAFORMA DE FORMACIÓN — TÉCNICAS DE AUDITORÍA INTERNA OEA
   Basada en la Norma ISO 19011:2018
   C.I. COLOMBIAN MINT S.A.S.
   ---------------------------------------------------------------------
   contenido.js  →  Auditores, Procesos y Contenido de los 9 módulos.
   Todo el contenido proviene de las 7 sesiones de la formación
   "Técnicas de Auditoría Interna OEA basada en ISO 19011:2018" (AEON).
   ===================================================================== */

/* ---- Equipo de Auditoría Interna (selección de usuario) ---- */
const AUDITORES = [
  { id: "erika-mesa",       nombre: "Erika Mesa",        cargo: "Analista Mesa Operativa" },
  { id: "estefania-granda", nombre: "Estefanía Granda",  cargo: "Oficial de Cumplimiento" },
  { id: "ivan-arias",       nombre: "Iván Arias",        cargo: "Líder Mesa Operativa y Comercio Exterior" },
  { id: "luis-arango",      nombre: "Luis Arango",       cargo: "Coord. Sistemas de Gestión" },
  { id: "juan-gomez",       nombre: "Juan Esteban Gómez",cargo: "Analista Contabilidad" },
  { id: "diego-beltran",    nombre: "Diego Beltrán",     cargo: "Analista Sistemas de Gestión" },
  { id: "luis-alvarez",     nombre: "Luis Álvarez",      cargo: "Analista Comercio Exterior" },
  { id: "diana-arboleda",   nombre: "Diana Arboleda",    cargo: "Asistente Administrativa y Experiencia" },
  { id: "albeiro-esteban",  nombre: "Albeiro Esteban",   cargo: "Coord. de Mantenimiento" },
  { id: "jimena-zuluaga",   nombre: "Jimena Zuluaga",    cargo: "Líder Contabilidad" }
];

/* ---- Procesos de C.I. Colombian Mint sujetos a la auditoría interna OEA ---- */
const PROCESOS = [
  { sigla: "GPE", nombre: "Gestión Planeación Estratégica" },
  { sigla: "GMC", nombre: "Gestión Mejoramiento Continuo" },
  { sigla: "GCP", nombre: "Gestión de Cumplimiento" },
  { sigla: "GCV", nombre: "Gestión Comercial y Vinculación de Proveedores de Metales, Minerales y Concentrados" },
  { sigla: "GCM", nombre: "Gestión Compra de Metales, Mineral y Concentrados" },
  { sigla: "GTR", nombre: "Trading" },
  { sigla: "GEX", nombre: "Gestión Exportaciones" },
  { sigla: "GPC", nombre: "Producción y Laboratorio" },
  { sigla: "MTO", nombre: "Mantenimiento" },
  { sigla: "GFC", nombre: "Gestión Financiera y Contable" },
  { sigla: "PVR", nombre: "Compras y Proveedores No Metales" },
  { sigla: "GTI", nombre: "Gestión Tecnología e Información" },
  { sigla: "SRF", nombre: "Seguridad y Protección" },
  { sigla: "GHM", nombre: "Gestión Humana" },
  { sigla: "SST", nombre: "Seguridad y Salud en el Trabajo" }
];

/* ---- Configuración de evaluación ---- */
const CONFIG = {
  preguntasPorQuiz: 10,        // preguntas que presenta cada módulo
  umbralAprobacion: 0.8,       // 80% para aprobar cada módulo y el curso
  cursoNombre: "Técnicas de Auditoría Interna de Operador Económico Autorizado OEA, Basada en Norma ISO 19011:2018",
  empresa: "C.I. COLOMBIAN MINT S.A.S.",
  areaResponsable: "Sistemas de Gestión"
};

/* =====================================================================
   MÓDULOS Y LECCIONES
   Cada módulo: { id, titulo, icono, resumen, lecciones:[{titulo, html}] }
   ===================================================================== */
const MODULOS = [
{
  id: "m1",
  titulo: "Módulo 1 · Contexto, Cadena de Suministro y Logística",
  icono: "🌐",
  resumen: "Entender el entorno de riesgo del comercio internacional, la cadena de suministro, la logística y por qué nace el programa OEA.",
  lecciones: [
    {
      titulo: "1.1 El contexto del comercio internacional y el riesgo",
      html: `
      <p>La formación parte de una premisa: Colombia ocupa una posición destacada en el <strong>Índice Global de Criminalidad</strong>, especialmente en la categoría de "Mayores Mercados Criminales". Operamos en un entorno donde las redes criminales (mafias europeas, cárteles mexicanos, tríadas asiáticas) buscan activamente vulnerabilidades para mover mercancías ilícitas, lavar activos y financiar operaciones.</p>
      <div class="callout callout-info"><strong>Idea central:</strong> debemos ser un OEA no inmunizado, sino un compromiso con la <em>vigilancia activa y la verificación constante</em> en todos los eslabones de la cadena.</div>
      <h4>Objetivos del curso</h4>
      <ul>
        <li><strong>Identificar</strong> la cadena de suministro, sus actores y los controles que mitigan los riesgos.</li>
        <li><strong>Contextualizar</strong> la gestión de riesgos aplicada a la cadena de suministro.</li>
        <li><strong>Revisar</strong> las iniciativas globales de seguridad (OMA, OEA, OMC, C-TPAT).</li>
        <li><strong>Conocer</strong> los requisitos OEA para ser exportador e importador con base en la resolución de la DIAN.</li>
        <li><strong>Capacitar</strong> auditores internos para mantener actualizado el sistema OEA.</li>
        <li><strong>Conocer</strong> las competencias que dan valor como auditor interno OEA.</li>
      </ul>`
    },
    {
      titulo: "1.2 La cadena de suministro",
      html: `
      <p>La <strong>cadena de suministro</strong> es el conjunto de actividades, instalaciones y medios de distribución necesarios para llevar a cabo el proceso de venta de un producto en su totalidad: desde la búsqueda de materias primas (proveedores), su transformación y/o fabricación, su transporte y la entrega al consumidor final.</p>
      <p><strong>Eslabones:</strong> Proveedores → Transporte → Fabricantes → Clientes, soportados por Comunicación y Tecnología.</p>
      <h4>Etapas de la cadena logística</h4>
      <ol><li>Importación</li><li>Exportación</li><li>Transporte</li><li>Almacenamiento</li><li>Agenciamiento</li></ol>
      <h4>Actores</h4>
      <p>Importadores, exportadores, transportistas, agencias de aduana, navieras, zonas francas, aerolíneas y aduanas.</p>`
    },
    {
      titulo: "1.3 Logística, las 7 C's y operadores logísticos",
      html: `
      <p>La <strong>logística</strong> es el conjunto de operaciones que hacen posible que un producto llegue al consumidor cumpliendo las "7 C's".</p>
      <h4>Las 7 C's de la logística</h4>
      <ol>
        <li>Producto Correcto</li><li>Cliente Correcto</li><li>Tiempo Correcto</li><li>Lugar Correcto</li>
        <li>Calidad Correcta</li><li>Cantidad Correcta</li><li>Costo Correcto</li>
      </ol>
      <p>La <strong>logística internacional</strong> es el conjunto de operaciones destinadas a transportar materias primas y productos finalizados desde el país de origen, demandando exportación o importación.</p>
      <h4>Operador logístico (pirámide 1PL – 5PL)</h4>
      <table class="tbl">
        <tr><th>Nivel</th><th>Alcance</th></tr>
        <tr><td>1PL</td><td>Transporte</td></tr>
        <tr><td>2PL</td><td>Transporte + almacenamiento</td></tr>
        <tr><td>3PL</td><td>Subcontratación de operaciones logísticas</td></tr>
        <tr><td>4PL</td><td>Integrador / gestión de toda la cadena</td></tr>
        <tr><td>5PL</td><td>Gestión de toda la cadena + tecnología / e-business</td></tr>
      </table>`
    },
    {
      titulo: "1.4 INCOTERMS y seguridad en la cadena de suministro",
      html: `
      <p>Los <strong>INCOTERMS</strong> (International Commercial Terms) son términos que definen las operaciones de compra-venta entre compañías de diferentes países. Regulan: la entrega de la mercancía, la transmisión de riesgos, la distribución de costos y los trámites documentales. <strong>No</strong> definen la propiedad ni resuelven procesos judiciales. Fueron establecidos por la Cámara de Comercio Internacional (ICC) en 1936; última versión 2020.</p>
      <h4>Seguridad en la cadena de suministro</h4>
      <p>Son las prácticas, estrategias y medidas implementadas para proteger las mercancías, los datos y los procesos frente a amenazas, riesgos y vulnerabilidades, garantizando que los productos lleguen a su destino de forma segura, eficiente y sin interrupciones.</p>
      <p><strong>Controles clave:</strong> normatividad, seguros, protocolos de seguridad, trazabilidad, seguridad de instalaciones, planes de contingencia y continuidad. Elementos: protección física de productos, ciberseguridad y gestión estratégica de riesgos.</p>`
    }
  ]
},
{
  id: "m2",
  titulo: "Módulo 2 · El Operador Económico Autorizado (OEA)",
  icono: "🏅",
  resumen: "Concepto, origen en el Marco SAFE, beneficios, categorías, marco legal colombiano, proceso de autorización y Acuerdos de Reconocimiento Mutuo.",
  lecciones: [
    {
      titulo: "2.1 ¿Qué es el OEA y de dónde nace?",
      html: `
      <p>El <strong>Operador Económico Autorizado (OEA)</strong> es una acreditación otorgada por la autoridad aduanera de cada país a una empresa que forma parte de la cadena de suministro internacional y que cumple con estándares de seguridad. El concepto fue propuesto por la <strong>Organización Mundial de Aduanas (OMA)</strong>.</p>
      <div class="callout callout-info"><strong>El OEA no es una invención local:</strong> nace del <strong>Marco SAFE</strong> de la OMA, cuyo objetivo es doble — <strong>garantizar la seguridad</strong> (niveles mínimos en el comercio internacional) y <strong>facilitar el comercio</strong> (agilizar el flujo de mercancías para empresas seguras y confiables).</div>
      <h4>Orígenes (línea de tiempo)</h4>
      <ul>
        <li><strong>11 de septiembre de 2001:</strong> atentados terroristas en EE.UU.</li>
        <li><strong>2004:</strong> la OMA presenta el Marco SAFE.</li>
        <li><strong>2005:</strong> doctrina C-TPAT y OEA.</li>
        <li><strong>2007:</strong> aprobación por la OMA.</li>
        <li><strong>2009:</strong> implementación del AEO en la Unión Europea.</li>
        <li><strong>2011:</strong> <strong>Decreto 3568</strong> crea el OEA en Colombia.</li>
        <li><strong>2016:</strong> <strong>Resolución 15378</strong> implementa el OEA en la DIAN.</li>
      </ul>
      <p>De los <strong>184 países</strong> miembros de la OMA, <strong>84</strong> tienen programas OEA en desarrollo. El nombre varía por país: AEO (UE), Secure Trade Partnership, PIP (Canadá), etc.</p>`
    },
    {
      titulo: "2.2 Beneficios del OEA",
      html: `
      <ol>
        <li><strong>Agilización de trámites aduaneros:</strong> despachos más rápidos, menos inspecciones físicas y documentales.</li>
        <li><strong>Reducción de costos operativos:</strong> menor riesgo de sanciones, optimización del proceso logístico.</li>
        <li><strong>Mayor seguridad y confiabilidad:</strong> mayor confianza de clientes y socios, reducción de fraude y contrabando.</li>
        <li><strong>Acceso a mercados internacionales:</strong> reconocimiento internacional y preferencias en acuerdos comerciales.</li>
        <li><strong>Mejora en la gestión interna:</strong> optimización de procesos, mayor control y visibilidad.</li>
        <li><strong>Mejora de la competitividad:</strong> ventaja frente a competidores.</li>
        <li><strong>Acceso a beneficios en acuerdos comerciales internacionales.</strong></li>
        <li><strong>Asesoría y capacitación continua</strong> por parte de la DIAN.</li>
      </ol>`
    },
    {
      titulo: "2.3 Categorías OEA y marco legal colombiano",
      html: `
      <h4>Categorías (DIAN)</h4>
      <ul>
        <li>Exportador</li><li>Importador</li><li>Agencias de Aduana</li>
        <li>Instalaciones Portuarias / Operadores Portuarios</li>
      </ul>
      <h4>Marco legal</h4>
      <table class="tbl">
        <tr><th>Norma</th><th>Contenido</th></tr>
        <tr><td>Decreto 3568 de 2011</td><td>Crea el OEA en Colombia.</td></tr>
        <tr><td>Resolución 15378 (Res. 15) de 2016</td><td>Implementa el OEA en la DIAN.</td></tr>
        <tr><td>Resolución 67 de 2016</td><td>Adiciona la Resolución 000015; firmada por DIAN, Policía Nacional e ICA.</td></tr>
        <tr><td>Ley 1581 (Habeas Data)</td><td>Protección de datos personales.</td></tr>
      </table>
      <p>Entidades validadoras según la categoría: <strong>DIAN</strong>, <strong>Policía Nacional (PONAL / Antinarcóticos)</strong>, <strong>ICA</strong> (fitosanitario) e <strong>Invima</strong> (sanitario).</p>`
    },
    {
      titulo: "2.4 Proceso de autorización y revalidación OEA",
      html: `
      <p>La autorización OEA tiene <strong>vigencia indefinida</strong>, pero está sujeta a <strong>revalidación cada dos (2) años</strong>.</p>
      <h4>Etapas del proceso (la "hoja de ruta" con la DIAN)</h4>
      <ol>
        <li><strong>Preparación y autoevaluación</strong> (fase interna y documental).</li>
        <li><strong>Presentación de la solicitud</strong> (radicación formal por los Servicios Informáticos Electrónicos – SIE).</li>
        <li><strong>Verificación de condiciones</strong> (DIAN y Policía validan requisitos financieros, legales y de trayectoria — Art. 7 Res. 15 de 2016).</li>
        <li><strong>Aceptación o rechazo</strong> de la solicitud.</li>
        <li><strong>Visita de validación</strong> (especialistas verifican en campo todos los requisitos; se generan "acciones requeridas" ante brechas).</li>
        <li><strong>Pronunciamiento y expedición de la resolución</strong> que autoriza al operador.</li>
      </ol>
      <p>Documentos para optar: estados financieros NIIF de los últimos 3 años, mapa de procesos, diagramas de flujo, matriz de riesgos (MARM – formato DIAN FT-IC-2101), organigrama y antecedentes.</p>`
    },
    {
      titulo: "2.5 Acuerdos de Reconocimiento Mutuo (ARM / MRA)",
      html: `
      <p>El <strong>Acuerdo de Reconocimiento Mutuo</strong> es el instrumento que permite a los países que lo suscriben reconocer mutuamente sus programas OEA: una empresa OEA en un país es tratada como segura en el otro, traduciéndose en <strong>menos inspecciones y mayor agilidad</strong>.</p>
      <div class="callout callout-key"><strong>Punto estratégico:</strong> el ARM firmado entre Colombia y EE.UU. (C-TPAT) significa que la aduana estadounidense reconoce nuestros estándares de seguridad OEA, lo que beneficia directamente las exportaciones de C.I. Colombian Mint.</div>
      <p>Países con ARM con Colombia incluyen: Estados Unidos, México, Chile, Perú, Bolivia, Brasil, Costa Rica, Uruguay, Guatemala, Paraguay, República Dominicana, Ecuador y Argentina.</p>`
    }
  ]
},
{
  id: "m3",
  titulo: "Módulo 3 · Riesgos y Amenazas en la Cadena de Suministro",
  icono: "⚠️",
  resumen: "Tipologías delictivas que amenazan la cadena (narcotráfico, lavado de activos, contrabando, tráfico de armas y personas, ciberdelitos) y por qué la certificación no reemplaza la verificación.",
  lecciones: [
    {
      titulo: "3.1 El entorno de riesgo: 'no estamos solos'",
      html: `
      <p>El programa OEA forma parte de una red mundial de iniciativas de seguridad. El panorama global del delito transnacional incluye narcotráfico, lavado de activos y ciberdelitos. La sesión refuerza la necesidad de controles internos <strong>robustos y dinámicos, no estáticos</strong>.</p>
      <h4>Riesgos a lo largo de la cadena</h4>
      <p>Hurto, contaminación, lavado de activos, narcotráfico, tráfico de armas, contrabando abierto y técnico, tráfico de personas y de órganos, bioterrorismo, terrorismo, sabotaje, falta de entrega, averías, soborno y corrupción.</p>`
    },
    {
      titulo: "3.2 Tipologías delictivas",
      html: `
      <ul>
        <li><strong>Tráfico de estupefacientes:</strong> consumo mundial — cannabis (~190 M), cocaína (~19 M), anfetaminas (~33,8 M). Auge del fentanilo y las drogas sintéticas (precursores y preprecursores).</li>
        <li><strong>Tráfico de armas:</strong> armas traídas desde EE.UU. para proveer a grupos armados ilegales en Colombia.</li>
        <li><strong>Trata de personas:</strong> esclavitud moderna, explotación sexual y reclutamiento por grupos armados.</li>
        <li><strong>Contrabando:</strong> abierto y técnico.</li>
        <li><strong>Ciberdelitos:</strong> ataques a plataformas web y secuestro de información (ej.: exigencia de rescate en criptomonedas).</li>
        <li><strong>Lavado de activos:</strong> uso de criptomonedas y testaferros.</li>
        <li><strong>Transnacionalización del delito:</strong> mafias rusa, italiana y china; en Colombia, Clan del Golfo, ELN, disidencias; Cartel de los Balcanes y cárteles mexicanos (CDS, CJNG).</li>
      </ul>`
    },
    {
      titulo: "3.3 Caso 'Confianza vs. Verificación' (ketamina)",
      html: `
      <p>Una empresa colombiana certificada OEA sufrió la contaminación de un contenedor con <strong>ketamina</strong>, declarado como "maquinaria industrial textil" de un proveedor recurrente "de confianza" en China.</p>
      <h4>Fallas críticas que lo permitieron</h4>
      <ul>
        <li><strong>Falta de inspección física en origen:</strong> se confió ciegamente en la reputación del proveedor.</li>
        <li><strong>Subcontratación no informada:</strong> el proveedor subcontrató la consolidación a un tercero desconocido, rompiendo la trazabilidad.</li>
        <li><strong>Falta de controles sobre terceros:</strong> transporte local sin verificación de antecedentes.</li>
        <li><strong>Desconexión interna:</strong> Comercio Exterior y Seguridad Logística no actuaron coordinadamente; la seguridad se basó solo en revisión documental.</li>
      </ul>
      <div class="callout callout-key"><strong>Lección principal para C.I. Colombian Mint:</strong> la confianza no reemplaza la verificación. La certificación OEA no es una inmunidad, sino un compromiso con la vigilancia activa y la verificación constante. La validación documental, por sí sola, es insuficiente.</div>`
    },
    {
      titulo: "3.4 Caso 'El contenedor Sombra' y la regla de oro",
      html: `
      <p>En un puerto colombiano se detectó un contenedor con armas escondidas (contaminación de carga). El caso enseña las señales de alerta y los protocolos.</p>
      <h4>Señales de alerta en carga sospechosa</h4>
      <ul><li>Anomalías en la densidad de la carga.</li><li>Distribución desigual.</li><li>Tamaño/forma no consistentes con lo declarado.</li><li>Sombras extrañas en imágenes de rayos X.</li></ul>
      <h4>Protocolo ante carga sospechosa</h4>
      <ul><li>Inmovilización del contenedor.</li><li>Notificación a las autoridades (DIAN, Policía, Fiscalía).</li><li>Inspección con scanner y verificación contra el manifiesto.</li></ul>
      <div class="callout callout-warning"><strong>Regla de oro:</strong> la empresa <strong>nunca</strong> investiga por cuenta propia. La verificación y la manipulación de la evidencia son responsabilidad exclusiva de las autoridades competentes.</div>
      <p><strong>Consecuencias de una contaminación:</strong> suspensión provisional o cancelación de los beneficios OEA, implicaciones penales para los representantes legales, mayores inspecciones, costos de defensa legal y daño reputacional irreparable.</p>`
    }
  ]
},
{
  id: "m4",
  titulo: "Módulo 4 · Iniciativas y Normas de Seguridad",
  icono: "🛡️",
  resumen: "Marco SAFE, C-TPAT, BASC 6.0:2022, ISO 28000:2022, ISO 27001 y el comparativo entre iniciativas de seguridad de la cadena de suministro.",
  lecciones: [
    {
      titulo: "4.1 Marco SAFE (OMA) y C-TPAT",
      html: `
      <p>El <strong>Marco SAFE</strong> de la OMA establece estándares para asegurar y facilitar el comercio global. Su estructura: cinco elementos básicos, tres pilares (Aduanas–Aduanas, Aduanas–Empresas, Aduanas–Otras autoridades), fortalecimiento de capacidades, continuidad del comercio y reconocimiento mutuo.</p>
      <h4>C-TPAT (Customs-Trade Partnership Against Terrorism)</h4>
      <p>Asociación <strong>voluntaria</strong> con la aduana de EE.UU. (CBP), nacida tras el 11-S. Sus <strong>Criterios Mínimos de Seguridad (MSC)</strong> se agrupan en:</p>
      <ul>
        <li><strong>Seguridad Corporativa:</strong> responsabilidad de la alta dirección, análisis de riesgo, seguridad de socios comerciales, ciberseguridad, seguridad de instrumentos de transporte.</li>
        <li><strong>Seguridad en Transportación:</strong> sellos de seguridad, procedimientos de seguridad, seguridad en agricultura.</li>
        <li><strong>Seguridad Física y de Personal:</strong> seguridad física, control de acceso físico, personal de seguridad, capacitación y concientización.</li>
      </ul>`
    },
    {
      titulo: "4.2 BASC 6.0:2022 e ISO 28000:2022",
      html: `
      <table class="tbl">
        <tr><th>Aspecto</th><th>BASC 6.0:2022</th><th>ISO 28000:2022</th></tr>
        <tr><td>Tipo</td><td>Certificación voluntaria</td><td>Norma ISO certificable</td></tr>
        <tr><td>Organismo</td><td>World BASC Organization</td><td>ISO</td></tr>
        <tr><td>Objetivo</td><td>Comercio libre de narcotráfico, terrorismo y contrabando</td><td>Gestionar riesgos de seguridad en toda la cadena</td></tr>
        <tr><td>Vigencia</td><td>Certificación anual</td><td>Certificado por 3 años</td></tr>
      </table>
      <p><strong>BASC</strong> = Business Alliance for Secure Commerce. Sus requisitos clave: seguridad física, control de accesos, capacitación y control documental.</p>`
    },
    {
      titulo: "4.3 ISO/IEC 27001:2022 — Seguridad de la información",
      html: `
      <p>Para fortalecer el Capítulo 8 (Seguridad de la Información), la formación introduce la <strong>ISO/IEC 27001</strong>, estándar para un Sistema de Gestión de Seguridad de la Información (SGSI). Su objetivo es proteger la <strong>confidencialidad, integridad y disponibilidad</strong> de la información.</p>
      <h4>Los 93 controles del Anexo A (4 dominios)</h4>
      <table class="tbl">
        <tr><th>Dominio</th><th>N° de controles</th><th>Ejemplos</th></tr>
        <tr><td>Organizativos</td><td>37</td><td>Políticas, roles, responsabilidades, gestión de terceros</td></tr>
        <tr><td>De Personas</td><td>8</td><td>Selección, capacitación, confidencialidad, procesos disciplinarios</td></tr>
        <tr><td>Físicos</td><td>14</td><td>Seguridad de áreas, equipos, acceso físico, cableado</td></tr>
        <tr><td>Tecnológicos</td><td>34</td><td>Cifrado, seguridad de redes, protección contra malware</td></tr>
      </table>`
    },
    {
      titulo: "4.4 La importancia del Reconocimiento Mutuo y el comparativo",
      html: `
      <p>Las iniciativas se comparan por: tipo de norma, objetivo, organismo, ámbito, certificación, reconocimiento internacional y categorías de control (gestión del riesgo, seguridad física, del personal, de TI/procesos, plan de respuesta a incidentes, auditorías y mejora continua, cumplimiento legal).</p>
      <div class="callout callout-info">La <strong>"Security"</strong> (C-TPAT, BASC, OEA/AEO, ISO 28000) protege contra actos ilícitos intencionales; la <strong>"Safety"</strong> protege contra accidentes. Ambas convergen en la cultura de gestión (ISO 9001).</div>`
    }
  ]
},
{
  id: "m5",
  titulo: "Módulo 5 · Gestión del Riesgo",
  icono: "📊",
  resumen: "ISO 31000:2018, modelo COSO, riesgo inherente vs. residual, análisis de 5 pasos C-TPAT y herramientas (PESTEL, DOFA-CAME, Porter, SIPOC, mapa de calor).",
  lecciones: [
    {
      titulo: "5.1 ISO 31000:2018 y definiciones clave",
      html: `
      <p>La <strong>NTC-ISO 31000:2018</strong> establece principios y directrices para gestionar el riesgo en cualquier organización. Objetivos: proporcionar un marco, mejorar la transparencia, apoyar el logro de objetivos y soportar la toma de decisiones.</p>
      <h4>Definiciones (ISO Guía 73 / ISO 31000)</h4>
      <ul>
        <li><strong>Riesgo:</strong> efecto de la incertidumbre sobre los objetivos.</li>
        <li><strong>Gestión del riesgo:</strong> actividades coordinadas para dirigir y controlar la organización con relación al riesgo.</li>
        <li><strong>Fuente de riesgo:</strong> elemento que, solo o combinado, tiene el potencial de generar riesgo.</li>
        <li><strong>Evento:</strong> ocurrencia o cambio en un conjunto particular de circunstancias.</li>
        <li><strong>Consecuencia:</strong> resultado de un evento que afecta los objetivos.</li>
        <li><strong>Probabilidad:</strong> posibilidad de que algo suceda.</li>
      </ul>
      <p><strong>Familia ISO 31000:</strong> ISO 31000 (principios y directrices), ISO/IEC 31010 (técnicas de evaluación del riesgo) e ISO Guía 73 (vocabulario).</p>`
    },
    {
      titulo: "5.2 Riesgo inherente vs. residual y modelo COSO",
      html: `
      <p><strong>Riesgo inherente:</strong> el que conlleva cada actividad en sí misma, en ausencia de acciones de la dirección (antes de aplicar controles). <strong>Riesgo residual:</strong> el que permanece después de implementar los controles.</p>
      <div class="callout callout-key"><strong>Riesgo inherente − Controles = Riesgo residual.</strong> El objetivo de la gestión es reducir el riesgo inherente al nivel residual aceptable.</div>
      <h4>Modelo COSO</h4>
      <p>Cinco componentes: 1) Ambiente/Entorno de Control; 2) Evaluación de Riesgos; 3) Actividades de Control; 4) Información y Comunicación; 5) Supervisión (Monitoreo).</p>`
    },
    {
      titulo: "5.3 Análisis de riesgos en 5 pasos (C-TPAT) y mapa de calor",
      html: `
      <h4>Cinco pasos C-TPAT</h4>
      <ol>
        <li>Mapear el flujo de la carga y los socios comerciales.</li>
        <li>Realizar una evaluación de amenazas.</li>
        <li>Realizar una evaluación de vulnerabilidades.</li>
        <li>Preparar un plan de acción para abordar las debilidades.</li>
        <li>Documentar cómo se realizan las evaluaciones (periódicas).</li>
      </ol>
      <p>El <strong>mapa de calor</strong> cruza la <strong>probabilidad</strong> (raro, improbable, posible, probable, casi seguro) con el <strong>impacto</strong> (leve, moderado, severo, catastrófico), generando zonas bajo (verde), moderado (amarillo), alto (naranja) y extremo (rojo).</p>`
    },
    {
      titulo: "5.4 Herramientas de análisis: PESTEL, DOFA-CAME, Porter, SIPOC, VUCA/BANI",
      html: `
      <ul>
        <li><strong>PESTEL:</strong> factores del macroentorno — Político, Económico, Social, Tecnológico, Ecológico y Legal.</li>
        <li><strong>DOFA / CAME:</strong> Debilidades, Oportunidades, Fortalezas, Amenazas → <strong>C</strong>orregir, <strong>A</strong>frontar, <strong>M</strong>antener, <strong>E</strong>xplotar.</li>
        <li><strong>5 Fuerzas de Porter:</strong> nuevos competidores, poder de proveedores, poder de clientes, productos sustitutos y rivalidad.</li>
        <li><strong>SIPOC:</strong> Supplier (proveedores), Input (entradas), Process (proceso), Output (salidas), Customer (clientes).</li>
        <li><strong>VUCA</strong> (Volátil, Incierto, Complejo, Ambiguo) y <strong>BANI</strong> (Frágil, Ansioso, No lineal, Incomprensible).</li>
      </ul>`
    },
    {
      titulo: "5.5 Objetivos SMART y top de riesgos",
      html: `
      <h4>Objetivos SMART</h4>
      <ul>
        <li><strong>S</strong> Específico — claro y preciso.</li>
        <li><strong>M</strong> Medible — cuantificable.</li>
        <li><strong>A</strong> Alcanzable — realista.</li>
        <li><strong>R</strong> Relevante — alineado con las metas.</li>
        <li><strong>T</strong> Temporal — con plazo definido.</li>
      </ul>
      <h4>Top de riesgos en Colombia 2025</h4>
      <p>Incendios y explosiones (46%), catástrofes naturales (43%), interrupción del negocio (41%), incidentes cibernéticos (30%), riesgos políticos y violencia (27%).</p>
      <p><strong>Riesgos emergentes</strong> (ISO 31050): impredecibles, inciertos, complejos, de baja probabilidad pero impacto potencialmente catastrófico.</p>`
    }
  ]
},
{
  id: "m6",
  titulo: "Módulo 6 · Requisitos OEA por Capítulo",
  icono: "📋",
  resumen: "Los 10 capítulos de requisitos de seguridad OEA (más sanitarios), qué auditar en cada uno y la inspección de 7 puntos, sellos ISO 17712 y controles de personal.",
  lecciones: [
    {
      titulo: "6.1 Estructura de los requisitos OEA",
      html: `
      <p>Los requisitos OEA se organizan en capítulos. El número de requisitos exigidos varía según la categoría y el validador responsable.</p>
      <table class="tbl">
        <tr><th>#</th><th>Capítulo</th><th>Exp.</th><th>Imp.</th><th>Ag. Aduana</th><th>Validador</th></tr>
        <tr><td>1</td><td>Condiciones Previas</td><td>17</td><td>17</td><td>17</td><td>DIAN</td></tr>
        <tr><td>2</td><td>Análisis y Administración del Riesgo</td><td>12</td><td>12</td><td>13</td><td>DIAN-PONAL</td></tr>
        <tr><td>3</td><td>Asociados de Negocio</td><td>2</td><td>3</td><td>3</td><td>DIAN</td></tr>
        <tr><td>4</td><td>Seguridad del Contenedor y Unidades de Carga</td><td>10</td><td>7</td><td>4</td><td>PONAL</td></tr>
        <tr><td>5</td><td>Controles de Acceso Físico</td><td>7</td><td>7</td><td>8</td><td>PONAL</td></tr>
        <tr><td>6</td><td>Seguridad del Personal</td><td>7</td><td>7</td><td>7</td><td>DIAN</td></tr>
        <tr><td>7</td><td>Seguridad de los Procesos</td><td>13</td><td>14</td><td>14</td><td>DIAN</td></tr>
        <tr><td>8</td><td>Seguridad Física</td><td>9</td><td>7</td><td>7</td><td>PONAL</td></tr>
        <tr><td>9</td><td>Seguridad en Tecnología de la Información</td><td>6</td><td>6</td><td>6</td><td>DIAN</td></tr>
        <tr><td>10</td><td>Entrenamiento en Seguridad y Conciencia de Amenazas</td><td>4</td><td>4</td><td>4</td><td>DIAN</td></tr>
        <tr><td colspan="2"><strong>Total Seguridad y Facilitación</strong></td><td><strong>87</strong></td><td><strong>84</strong></td><td><strong>83</strong></td><td></td></tr>
        <tr><td>11</td><td>Seguridad Fitosanitaria y Sanitaria</td><td>19</td><td>10</td><td>0</td><td>ICA</td></tr>
        <tr><td>12</td><td>Seguridad Sanitaria</td><td>11</td><td>0</td><td>0</td><td>INVIMA</td></tr>
      </table>`
    },
    {
      titulo: "6.2 Cap. 1 y 2 — Riesgo y Asociados de Negocio",
      html: `
      <p><strong>Análisis y Administración del Riesgo:</strong> tener una <strong>política de gestión de la seguridad</strong> documentada, conocida y aplicada por todo el personal (Req. 1.1, Res. 015/067), y un <strong>sistema de administración del riesgo</strong> (Req. 1.2). Las <strong>7 actividades ilícitas</strong> a prevenir: lavado de activos, contrabando, tráfico de estupefacientes, tráfico de sustancias para procesamiento de narcóticos, terrorismo, financiación del terrorismo y tráfico de armas. Deben definirse las <strong>áreas críticas</strong> (Req. 1.11).</p>
      <p><strong>Asociados de Negocio:</strong> tener procedimientos documentados para la selección, evaluación y conocimiento de los asociados (Req. 2.1), realizar visitas/verificación (Req. 1.5) y exigir manifestación de cumplimiento (Req. 1.4). Asociados: fabricante, proveedor, cliente, transporte, operador logístico, depósito, etc.</p>`
    },
    {
      titulo: "6.3 Cap. 3 — Seguridad del contenedor: inspección de 7 puntos y sellos",
      html: `
      <div class="callout callout-info"><strong>Objetivo:</strong> garantizar que cada contenedor que sale es una "caja fuerte" segura y estéril.</div>
      <h4>Inspección de 7 puntos (Req. 3.6 y 3.8)</h4>
      <ol>
        <li>Pared frontal</li><li>Lado izquierdo</li><li>Lado derecho</li><li>Piso</li>
        <li>Techo (interior y exterior)</li><li>Puertas (interior y exterior)</li><li>Exterior / sección inferior</li>
      </ol>
      <p><strong>Sellos de alta seguridad (Req. 3.3):</strong> deben cumplir o exceder la <strong>norma ISO 17712</strong>; es obligatorio solicitar y archivar el <strong>certificado de conformidad</strong> del proveedor.</p>
      <p><strong>Procedimiento y registro de sellado (Req. 3.4):</strong> llevar una bitácora con número de sello, fecha, placa del vehículo y firma del responsable.</p>`
    },
    {
      titulo: "6.4 Cap. 4 y 5 — Acceso físico y personal",
      html: `
      <h4>Controles de Acceso Físico</h4>
      <ul>
        <li><strong>Identificación visible</strong> del personal en todo momento (Req. 4.3).</li>
        <li><strong>Control de visitantes</strong> (Req. 4.4 y 4.6): registro, identificación temporal visible y escolta permanente en áreas críticas.</li>
        <li><strong>Revisión en accesos</strong> (Req. 4.5): paquetes, maletines y vehículos al ingreso y salida.</li>
      </ul>
      <h4>Seguridad del Personal</h4>
      <ul>
        <li><strong>Selección y vinculación</strong> con verificación de antecedentes (Req. 5.1).</li>
        <li><strong>Estudios socioeconómicos bienales</strong> para cargos críticos; no basta hacerlos, hay que <strong>analizar los resultados</strong> (Req. 5.3/5.4).</li>
        <li><strong>Procedimiento de retiro</strong> con checklist: devolución de carné/equipos y <strong>desactivación inmediata de accesos</strong> (Req. 5.5).</li>
        <li>Historia laboral actualizada anualmente (Req. 5.2) y código de ética (Req. 5.7).</li>
      </ul>`
    },
    {
      titulo: "6.5 Cap. 6, 7, 8 y 9 — Procesos, física, TI y entrenamiento",
      html: `
      <h4>Seguridad de los Procesos (Cap. 6)</h4>
      <ul>
        <li>Control documental (Req. 6.2) y trazabilidad de la carga (Req. 6.3 y 6.4).</li>
        <li><strong>Plan de contingencia y continuidad</strong> ante desastres (Req. 6.6).</li>
        <li>Comprobar que la carga corresponde a lo embarcado (Req. 6.7).</li>
        <li><strong>Reportar irregularidades a la autoridad</strong> competente (Req. 6.12).</li>
      </ul>
      <h4>Seguridad Física (Cap. 7)</h4>
      <p>Barreras perimetrales (7.1), iluminación y señalización (7.2/7.5), control de estacionamiento en áreas críticas (7.3) y <strong>vigilancia 24/7</strong> (7.6).</p>
      <h4>Seguridad en TI (Cap. 8)</h4>
      <p>Sistemas de control (8.1), políticas y contraseñas con cambio periódico (8.2), plan de contingencia de sistemas (8.5) y centro de cómputo protegido con acceso restringido (8.6). Clasificación de activos: información, físicos, servicios de TI y humanos.</p>
      <h4>Entrenamiento (Cap. 9)</h4>
      <p>Inducción/reinducción (9.1), capacitación especializada (9.2), política preventiva de alcohol y drogas (9.3) y <strong>Plan Maestro de Emergencia</strong> con simulacros (9.4).</p>`
    }
  ]
},
{
  id: "m7",
  titulo: "Módulo 7 · Norma ISO 19011:2018",
  icono: "📖",
  resumen: "Definición de auditoría, principios, términos y definiciones, tipos de auditoría, criterios y la gestión del programa de auditoría.",
  lecciones: [
    {
      titulo: "7.1 ¿Qué es la ISO 19011 y qué es una auditoría?",
      html: `
      <p>La <strong>ISO 19011:2018</strong> — "Directrices para la auditoría de los sistemas de gestión" — es nuestro manual para auditar. Aplica a auditorías internas (primera parte) y externas (segunda parte) de cualquier sistema de gestión (ISO 9001, 14001, 45001, 28000…).</p>
      <div class="callout callout-key"><strong>Auditoría (3.1):</strong> proceso <strong>sistemático, independiente y documentado</strong> para obtener <strong>evidencias objetivas</strong> y evaluarlas de manera objetiva con el fin de determinar el grado en que se cumplen los <strong>criterios de auditoría</strong>.</div>
      <p>Partes de la norma: 4) Principios; 5) Gestión del programa; 6) Realización de la auditoría; 7) Competencia y evaluación de los auditores.</p>`
    },
    {
      titulo: "7.2 Los principios de la auditoría",
      html: `
      <ol>
        <li><strong>Integridad:</strong> ser honestos y responsables.</li>
        <li><strong>Presentación imparcial (ecuánime):</strong> reportar con veracidad y exactitud.</li>
        <li><strong>Debido cuidado profesional:</strong> ser diligentes y tener buen juicio.</li>
        <li><strong>Confidencialidad:</strong> proteger la información obtenida.</li>
        <li><strong>Independencia:</strong> ser imparciales y objetivos.</li>
        <li><strong>Enfoque basado en la evidencia:</strong> las conclusiones se basan en pruebas verificables, no en suposiciones.</li>
        <li><strong>Enfoque basado en riesgos.</strong></li>
      </ol>`
    },
    {
      titulo: "7.3 Términos y definiciones clave",
      html: `
      <table class="tbl">
        <tr><th>Término</th><th>Definición</th></tr>
        <tr><td>Criterios de auditoría (3.7)</td><td>Conjunto de requisitos usados como referencia frente a la cual se compara la evidencia objetiva.</td></tr>
        <tr><td>Evidencia objetiva (3.8)</td><td>Datos que respaldan la existencia o veracidad de algo.</td></tr>
        <tr><td>Evidencia de auditoría (3.9)</td><td>Registros, declaraciones de hechos u otra información pertinente y verificable.</td></tr>
        <tr><td>Auditado (3.13)</td><td>Organización que es auditada en su totalidad o partes.</td></tr>
        <tr><td>Equipo auditor (3.14)</td><td>Una o más personas que llevan a cabo una auditoría, con apoyo de expertos técnicos si se requiere.</td></tr>
        <tr><td>Auditor (3.15)</td><td>Persona que lleva a cabo una auditoría.</td></tr>
        <tr><td>Conformidad (3.20)</td><td>Cumplimiento de un requisito.</td></tr>
        <tr><td>No conformidad (3.21)</td><td>Incumplimiento de un requisito.</td></tr>
        <tr><td>Eficacia (3.26)</td><td>Grado en que se realizan las actividades planificadas y se logran los resultados planificados.</td></tr>
      </table>`
    },
    {
      titulo: "7.4 Tipos de auditoría y criterios",
      html: `
      <h4>Por la parte que la realiza</h4>
      <ul>
        <li><strong>Primera parte:</strong> auditoría interna.</li>
        <li><strong>Segunda parte:</strong> auditoría externa a proveedores o partes interesadas.</li>
        <li><strong>Tercera parte:</strong> certificación, acreditación o legal (ISO/IEC 17021).</li>
      </ul>
      <h4>Por el objeto</h4>
      <p>Auditoría de proceso, de sistema (auditar todos los elementos) y de producto (cumple especificaciones).</p>
      <h4>Criterios de auditoría</h4>
      <ul>
        <li><strong>Cumplimiento:</strong> leyes, reglamentos, contratos, normas (externos).</li>
        <li><strong>Conformidad:</strong> políticas, planes, procedimientos y prácticas (internos).</li>
        <li><strong>Desempeño:</strong> objetivos (eficacia).</li>
      </ul>`
    },
    {
      titulo: "7.5 Gestión del programa de auditoría",
      html: `
      <p>El <strong>programa de auditorías</strong> define: propósito, alcance, criterios, recursos, cronograma, auditados y auditores. Se planifica a lo largo del año (cronograma tipo Gantt por norma).</p>
      <p>Quien gestiona el programa debe tener conocimiento y habilidad en: 1) principios, procedimientos y métodos; 2) normas y documentos de referencia; 3) actividades, productos y procesos; 4) requisitos legales; 5) clientes, proveedores y partes interesadas.</p>
      <p>Etapas (cláusula 5): objetivos del programa → determinación y evaluación de riesgos → establecimiento → implementación → seguimiento → revisión y mejora.</p>`
    }
  ]
},
{
  id: "m8",
  titulo: "Módulo 8 · El Auditor y la Ejecución de la Auditoría",
  icono: "🧑‍💼",
  resumen: "Perfil y competencias del auditor interno, reunión de apertura y de cierre, listas de chequeo, redacción de hallazgos e informe.",
  lecciones: [
    {
      titulo: "8.1 El auditor interno: perfil y competencias",
      html: `
      <p>El <strong>auditor interno</strong> es la persona con la competencia para llevar a cabo una auditoría. La competencia se demuestra mediante <strong>educación, formación, experiencia y habilidades</strong>.</p>
      <h4>Perfil</h4>
      <ul>
        <li><strong>Educación:</strong> profesional, técnico, tecnólogo o en formación.</li>
        <li><strong>Formación:</strong> curso de auditor interno en la norma vigente.</li>
        <li><strong>Experiencia:</strong> participación en una auditoría del Sistema de Gestión en Control y Seguridad, al menos como observador.</li>
        <li><strong>Habilidades:</strong> asertividad, comprensión de lectura, redacción, expresión oral, identificación causa-consecuencia, manejo del tiempo, toma de decisiones.</li>
      </ul>
      <h4>Funciones</h4>
      <p>Evaluar controles internos, detectar errores y fraudes, asegurar el cumplimiento normativo, recomendar mejoras y reportar hallazgos a la dirección.</p>`
    },
    {
      titulo: "8.2 Listas de chequeo (checklists)",
      html: `
      <p>Las <strong>listas de chequeo</strong> son herramientas organizadas que enumeran de forma sistemática ítems, pasos o requisitos a verificar. Su objetivo es asegurar que <strong>nada importante se omita</strong>.</p>
      <p>Características: sistemática y estructurada, clara y concisa, verificable, enfocada en objetivos, flexible, preventiva y fácil de usar.</p>`
    },
    {
      titulo: "8.3 Realización de la auditoría: apertura y cierre",
      html: `
      <h4>Reunión de apertura (guion)</h4>
      <ol>
        <li>Bienvenida y presentación del equipo auditor.</li>
        <li>Objetivo de la auditoría.</li>
        <li>Alcance.</li>
        <li>Metodología (revisión documental, entrevistas, observación).</li>
        <li>Cronograma tentativo.</li>
        <li>Canales de comunicación.</li>
        <li>Compromiso.</li>
        <li>Preguntas y comentarios.</li>
        <li>Cierre.</li>
      </ol>
      <h4>Reunión de cierre (guion)</h4>
      <ol>
        <li>Bienvenida y agradecimientos.</li>
        <li>Resumen del proceso de auditoría.</li>
        <li>Hallazgos y fortalezas.</li>
        <li>Novedades y oportunidades de mejora.</li>
        <li>Próximos pasos (informe, plazos).</li>
        <li>Preguntas y comentarios.</li>
        <li>Cierre.</li>
      </ol>`
    },
    {
      titulo: "8.4 Redacción de hallazgos y el informe",
      html: `
      <div class="callout callout-key">Clasificación de hallazgos: <strong>No Conformidades (NC)</strong>, <strong>Observaciones</strong> y <strong>Oportunidades de Mejora</strong>, indicando el impacto de cada uno en el cumplimiento OEA.</div>
      <p><strong>Redacción del informe:</strong> lenguaje técnico claro y estructurado, incluyendo objetivos, alcance, criterios, hallazgos, evidencia, evaluación del riesgo y recomendaciones.</p>
      <p><strong>Presentación a la dirección:</strong> informe ejecutivo con hallazgos críticos, cumplimiento actual frente a la norma y plan de acción sugerido.</p>
      <p><strong>Verificación de acciones:</strong> seguimiento a las acciones correctivas con fechas límite, responsables y evidencias; re-auditorías si es necesario.</p>`
    },
    {
      titulo: "8.5 Planes de acción para hallazgos",
      html: `
      <p>Un <strong>plan de acción</strong> describe las tareas, responsables, recursos, plazos e indicadores necesarios para resolver un hallazgo.</p>
      <p>Estructura: definición, objetivo, acciones, responsable, recursos, plazos, indicadores y seguimiento.</p>`
    }
  ]
},
{
  id: "m9",
  titulo: "Módulo 9 · Aplicación en C.I. Colombian Mint",
  icono: "🏭",
  resumen: "Cómo aplicar la auditoría interna OEA a los 15 procesos de la empresa, el caso práctico FRIOFORT y la integración final.",
  lecciones: [
    {
      titulo: "9.1 La auditoría interna OEA en los procesos de la empresa",
      html: `
      <p>La auditoría interna OEA se aplica de forma <strong>transversal</strong> a todos los procesos de C.I. Colombian Mint. Cada capítulo de requisitos se asigna a las áreas responsables (mapa de responsabilidades): Seguridad del Personal → Gestión Humana; Seguridad en TI → Tecnología; etc.</p>
      <h4>Los 15 procesos auditables</h4>
      <ul>
        <li><strong>GPE</strong> — Gestión Planeación Estratégica</li>
        <li><strong>GMC</strong> — Gestión Mejoramiento Continuo</li>
        <li><strong>GCP</strong> — Gestión de Cumplimiento</li>
        <li><strong>GCV</strong> — Gestión Comercial y Vinculación de Proveedores de Metales</li>
        <li><strong>GCM</strong> — Gestión Compra de Metales, Mineral y Concentrados</li>
        <li><strong>GTR</strong> — Trading</li>
        <li><strong>GEX</strong> — Gestión Exportaciones</li>
        <li><strong>GPC</strong> — Producción y Laboratorio</li>
        <li><strong>MTO</strong> — Mantenimiento</li>
        <li><strong>GFC</strong> — Gestión Financiera y Contable</li>
        <li><strong>PVR</strong> — Compras y Proveedores No Metales</li>
        <li><strong>GTI</strong> — Gestión Tecnología e Información</li>
        <li><strong>SRF</strong> — Seguridad y Protección</li>
        <li><strong>GHM</strong> — Gestión Humana</li>
        <li><strong>SST</strong> — Seguridad y Salud en el Trabajo</li>
      </ul>`
    },
    {
      titulo: "9.2 Mapeo de capítulos OEA a los procesos",
      html: `
      <table class="tbl">
        <tr><th>Capítulo OEA</th><th>Procesos más relacionados</th></tr>
        <tr><td>Análisis y Administración del Riesgo</td><td>GCP, GPE, GMC</td></tr>
        <tr><td>Asociados de Negocio</td><td>GCV, GCM, PVR, GTR</td></tr>
        <tr><td>Seguridad del Contenedor / Carga</td><td>GEX, GPC, SRF</td></tr>
        <tr><td>Controles de Acceso Físico</td><td>SRF, MTO</td></tr>
        <tr><td>Seguridad del Personal</td><td>GHM</td></tr>
        <tr><td>Seguridad de los Procesos</td><td>GEX, GPC, GFC</td></tr>
        <tr><td>Seguridad Física</td><td>SRF, MTO</td></tr>
        <tr><td>Seguridad en TI</td><td>GTI</td></tr>
        <tr><td>Entrenamiento y Conciencia</td><td>GHM, SST</td></tr>
        <tr><td>Seguridad Sanitaria/Fitosanitaria</td><td>GPC, SST</td></tr>
      </table>`
    },
    {
      titulo: "9.3 Caso práctico FRIOFORT S.A.S.",
      html: `
      <p>FRIOFORT contrató un equipo auditor para identificar acciones requeridas y recomendadas antes de presentarse a la validación OEA. El ejercicio integró: <strong>Programa de Auditoría 2025</strong> (cronograma mensual por áreas), <strong>Plan de Visita</strong> (equipo auditor, alcance), <strong>cronograma de 2 días</strong>, <strong>reunión de apertura y cierre</strong>, y la <strong>redacción de hallazgos</strong>.</p>
      <p>El caso "Exportadora Ficticia S.A.S." mostró el incumplimiento del Capítulo 2 (Asociados de Negocio): un operador logístico sin certificación, sin visitas de seguimiento en 3 años y con evaluación documental desactualizada (2 años), incumpliendo los numerales 2.1, 1.4 y 1.5.</p>`
    },
    {
      titulo: "9.4 Conclusiones e integración",
      html: `
      <div class="callout callout-key">
      <ul>
        <li>La certificación OEA <strong>no garantiza inmunidad</strong> ante los riesgos.</li>
        <li>La <strong>confianza no reemplaza la verificación</strong>.</li>
        <li>Las auditorías internas deben ser <strong>dinámicas</strong>, no solo programadas.</li>
        <li>El mapa de riesgos debe ser <strong>genuino y dinámico</strong>.</li>
        <li>La auditoría interna debe ser <strong>transversal</strong> a toda la organización.</li>
      </ul>
      </div>
      <p>Al completar este módulo, el auditor interno está preparado para apoyar a los procesos auditados, fortalecer el Sistema de Gestión en Control y Seguridad (SGCS) y mantener la acreditación OEA de C.I. Colombian Mint.</p>`
    }
  ]
}
];
