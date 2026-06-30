# Plataforma de Formación — Técnicas de Auditoría Interna OEA (ISO 19011:2018)
### C.I. Colombian Mint S.A.S. · Área responsable: Sistemas de Gestión

Aplicación web interactiva (HTML/CSS/JavaScript, 100% del lado del cliente) para
que el equipo de auditoría interna repase el curso por módulos, conteste las
evaluaciones y obtenga su diploma al cumplir el curso.

## 1. Estructura de archivos
```
Plataforma Auditoria OEA/
├── index.html            ← se abre este archivo
├── css/estilos.css       ← diseño
└── js/
    ├── contenido.js      ← 9 módulos y sus lecciones
    ├── preguntas.js      ← banco de 217 preguntas (24+ por módulo)
    └── app.js            ← lógica (progreso, evaluaciones, diploma)
```

## 2. Cómo usarla
1. Abrir `index.html` con un navegador (Edge, Chrome o Firefox). Doble clic basta.
2. El colaborador **selecciona su nombre** de la lista de auditores.
3. Recorre los módulos **en orden**: cada módulo se desbloquea al completar el anterior.
4. En cada módulo debe **leer todas las lecciones** (se marcan con ✓) y luego
   **presentar la evaluación** (10 preguntas).
5. Para **aprobar** cada módulo se requiere **mínimo 80%**. Se puede reintentar
   cuantas veces sea necesario; en cada intento las preguntas se barajan.
6. Al completar los 9 módulos se habilita el **Diploma**, que puede imprimirse o
   guardarse como PDF y enviarse a Sistemas de Gestión.

## 3. Banco de preguntas y aleatoriedad
- **217 preguntas** de selección múltiple con **una sola respuesta verdadera**.
- Cada módulo tiene un pool de 24–25 preguntas; la evaluación toma 10 al azar.
- El azar se "siembra" con el nombre del auditor + módulo + intento, de modo que
  **distintos auditores reciben distintos subconjuntos** y se minimiza la repetición.
- Tras finalizar, se muestra la **retroalimentación** (respuesta correcta + justificación).

## 4. Calificación y diploma
- Umbral de aprobación: **80%** por módulo (configurable).
- El **puntaje global** es el promedio de los mejores puntajes de los 9 módulos.
- El diploma incluye nombre, cargo, curso, puntaje global, fecha y un **código de
  verificación** único por auditor.

## 5. Publicación en la Intranet
- Copiar la carpeta `Plataforma Auditoria OEA` completa a la carpeta del sitio de
  la Intranet (o a un recurso compartido) **conservando la estructura de carpetas**.
- Enlazar a `index.html`. No requiere servidor de aplicaciones ni base de datos.
- El progreso se guarda en el **navegador de cada equipo** (localStorage). Si los
  auditores cambian de equipo, deben completar el curso en el mismo equipo o se
  recomienda exportar la constancia (.txt) / guardar el PDF como evidencia.

## 6. Personalización
- **Auditores y procesos:** editar los arreglos `AUDITORES` y `PROCESOS` en `js/contenido.js`.
- **Preguntas:** agregar/editar objetos en `js/preguntas.js` (campo `m` = id del módulo).
- **Umbral o N° de preguntas:** ajustar `CONFIG` en `js/contenido.js`
  (`umbralAprobacion`, `preguntasPorQuiz`).

## 7. Origen del contenido
Todo el contenido proviene de las 7 sesiones de la formación *"Técnicas de
Auditoría Interna de Operador Económico Autorizado OEA, Basada en Norma ISO
19011:2018"* (AEON Supply Chain Security Consulting), resumidas en
`_Contenido Capacitación/_notas_contenido/`.
