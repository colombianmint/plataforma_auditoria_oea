# Guía de publicación — Plataforma de Formación OEA

El sitio es **estático** (HTML/CSS/JS). No necesita compilación ni servidor.
Datos a recordar para cualquier hosting:
- **Carpeta a publicar / raíz:** la carpeta `Plataforma Auditoria OEA` (contiene `index.html`).
- **Build command (comando de compilación):** *ninguno / dejar en blanco*.
- **Publish directory (directorio de publicación):** `.` (la raíz).

> Nota: el progreso de cada auditor se guarda en el navegador del equipo donde
> estudia (localStorage). Por eso conviene que cada persona termine el curso en
> el mismo equipo/navegador y descargue su diploma/constancia como evidencia.

---

## OPCIÓN A — Netlify Drop (la más rápida, sin cuenta técnica) ⭐ recomendada para empezar

1. Abre **https://app.netlify.com/drop**
2. Arrastra la carpeta **`Plataforma Auditoria OEA`** completa al recuadro.
3. Netlify la sube y te da una URL pública del tipo `https://nombre-aleatorio.netlify.app`.
4. (Opcional) Crea una cuenta gratuita para conservar el sitio y cambiar el nombre
   en **Site settings → Change site name** (por ej. `formacion-oea-colombianmint`).
5. ¡Listo! Comparte la URL. Para **actualizar**, vuelve a arrastrar la carpeta.

---

## OPCIÓN B — GitHub + Netlify (con control de versiones y auto-actualización) ⭐ recomendada a largo plazo

### Paso 1 · Crear el repositorio en GitHub
1. Entra a **https://github.com** e inicia sesión (o crea una cuenta).
2. Botón **New** (nuevo repositorio).
3. Nombre: `formacion-oea` (o el que prefieras). Visibilidad: **Private** o **Public**.
4. **NO** marques "Add a README" (ya tenemos archivos). Clic en **Create repository**.
5. Copia la URL que muestra GitHub, por ejemplo:
   `https://github.com/TU-USUARIO/formacion-oea.git`

### Paso 2 · Subir el código (el repositorio local ya está listo y con el primer commit)
Abre una terminal en la carpeta `Plataforma Auditoria OEA` y ejecuta:

```bash
git remote add origin https://github.com/TU-USUARIO/formacion-oea.git
git push -u origin main
```

> Te pedirá iniciar sesión en GitHub (se abre el navegador). Si pide usuario/clave,
> usa tu usuario y un **token personal** (GitHub → Settings → Developer settings →
> Personal access tokens) en lugar de la contraseña.

### Paso 3 · Conectar Netlify al repositorio
1. Entra a **https://app.netlify.com** → **Add new site → Import an existing project**.
2. Elige **GitHub** y autoriza el acceso; selecciona el repositorio `formacion-oea`.
3. Configuración de build:
   - **Build command:** *(vacío)*
   - **Publish directory:** `.`
4. Clic en **Deploy**. En segundos tendrás la URL pública.
5. Cada vez que hagas `git push`, Netlify **vuelve a publicar automáticamente**.

---

## OPCIÓN C — GitHub + Vercel

1. Realiza el **Paso 1 y 2** de la Opción B (crear repo y `git push`).
2. Entra a **https://vercel.com** → **Add New → Project** → importa el repo de GitHub.
3. Framework Preset: **Other**. Build command: *(vacío)*. Output directory: dejar por defecto / `.`.
4. **Deploy**. Vercel te da una URL `https://formacion-oea.vercel.app` y también
   se actualiza sola con cada `git push`.

---

## OPCIÓN D — GitHub Pages (sin Netlify ni Vercel)

1. Realiza el **Paso 1 y 2** de la Opción B.
2. En el repo de GitHub: **Settings → Pages**.
3. En "Build and deployment" → Source: **Deploy from a branch**.
4. Branch: **main** / carpeta **/ (root)** → **Save**.
5. En 1–2 minutos el sitio queda en `https://TU-USUARIO.github.io/formacion-oea/`.

---

## Cómo actualizar el contenido más adelante
Edita los archivos (por ejemplo `js/preguntas.js`) y luego:

```bash
git add -A
git commit -m "Actualizo preguntas del módulo X"
git push
```

Netlify / Vercel / GitHub Pages publican los cambios automáticamente.

---

## Recomendación
- ¿Necesitas publicarlo **ya** y sin complicaciones? → **Opción A (Netlify Drop)**.
- ¿Quieres mantenerlo, versionarlo y actualizarlo fácil? → **Opción B (GitHub + Netlify)**.
