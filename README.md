# Formación OEA · Técnicas de Auditoría Interna (ISO 19011:2018)
### C.I. Colombian Mint S.A.S.

Sitio web estático (HTML/CSS/JavaScript) para la formación interna del equipo de
auditoría OEA. No requiere servidor ni base de datos: el progreso de cada auditor
se guarda en el navegador (localStorage).

## Estructura
```
index.html            ← página principal (raíz del sitio)
css/estilos.css
js/contenido.js       ← módulos y lecciones
js/preguntas.js       ← banco de 217 preguntas
js/app.js             ← lógica, evaluaciones y diploma
netlify.toml          ← configuración de despliegue (Netlify)
```

## Despliegue
Cualquier hosting de sitios estáticos sirve. Ver `GUIA-PUBLICACION.md` para el
paso a paso en GitHub, Netlify y Vercel.

- **Publish directory / raíz:** `.` (la carpeta contiene `index.html`).
- **Build command:** *(ninguno)*.
