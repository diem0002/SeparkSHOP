# Guía de Despliegue en Vercel (100% Gratis)

Esta guía te llevará paso a paso para poner tu Tienda Separk en internet usando servicios gratuitos profesionales.

## Requisitos Previos

1.  Una cuenta en **GitHub** (https://github.com/).
2.  Una cuenta en **Vercel** (https://vercel.com/) conectada a tu GitHub.

---

## Paso 1: Subir tu Código a GitHub

Como tu código ahora vive en tu PC, necesitamos subirlo a "la nube de código" (GitHub).

1.  Ve a https://github.com/new y crea un nuevo repositorio llamado `separk-shop` (público o privado, da igual).
2.  **¡IMPORTANTE!**: No marques "Add README" ni ninguna otra casilla. Crea el repo vacío.
3.  Abre tu terminal en la carpeta del proyecto y ejecuta estos comandos uno por uno:

*(Si ya ejecutaste los comandos que te di en el chat, puedes saltar al Paso 2).*

---

## Paso 2: Crear el Proyecto en Vercel

1.  Entra a tu Dashboard de Vercel (https://vercel.com/dashboard).
2.  Haz clic en **"Add New..."** -> **"Project"**.
3.  Verás tu repositorio `SeparkSHOP` (o el nombre que le hayas puesto) en la lista. Haz clic en **"Import"**.
4.  **Configuración del Proyecto**:
    *   **Framework Preset**: Next.js (se detecta solo).
    *   **Root Directory**: `./` (se detecta solo).
    *   **Environment Variables**:
        *   Abre la sección y agrega:
        *   `AUTH_SECRET`: Genera uno nuevo (puedes escribir letras al azar largas y seguras).
        *   `ADMIN_EMAIL`: Tu correo real (para entrar como admin).
        *   `ADMIN_PASSWORD`: Tu contraseña de admin.
5.  Haz clic en **"Deploy"**.
    *   *Nota*: Es probable que el primer despliegue **falle** porque aún no tenemos la base de datos conectada. ¡No te asustes! Es normal.

---

## Paso 3: Conectar Base de Datos (Vercel Postgres)

1.  Una vez creado el proyecto (aunque falle el deploy), ve a la pestaña **"Storage"** en el menú de arriba de tu proyecto Vercel.
2.  Haz clic en **"Connect Store"** -> **"Create New"** -> **"Postgres"**.
3.  Acepta los términos, ponle nombre (ej: `separk-db`) y selecciona la región (ej: `Washington, D.C. - iad1` o la más cercana a ti de las "Free").
4.  Dale a **"Create"**.
5.  Vercel agregará automáticamente las variables de entorno (`POSTGRES_URL`, etc.) a tu proyecto.

---

## Paso 4: Conectar Almacenamiento de Imágenes (Vercel Blob)

Como cambiamos el código para no guardar fotos en el disco duro (que se borra en la nube), usaremos Vercel Blob.

1.  En la misma pestaña **"Storage"**, haz clic en **"Connect Store"** (quizás debas volver atrás primero).
2.  Selecciona **"Blob"**.
3.  Dale a **"Continue"** para crearlo.
4.  Vercel agregará automáticamente la variable `BLOB_READ_WRITE_TOKEN`.

---

## Paso 5: Puesta en Marcha Final

1.  Ve a la pestaña **"Deployments"**.
2.  Busca el último despliegue (el que probablemente falló o el último que hiciste).
3.  Haz clic en los tres puntos `...` -> **"Redeploy"**.
    *   Esto es necesario para que el proyecto "lea" las nuevas variables de base de datos y Blob que acabamos de crear.
4.  Espera a que termine (se ponga verde).

### Inicializar la Base de Datos

Ahora tu sitio está vivo, pero la base de datos está vacía y sin tablas. Necesitamos ejecutar el "seed" en la nube para cargar los productos.

Vercel no tiene una terminal interactiva fácil, pero podemos usar tu PC para esto:

1.  En tu terminal local (en tu PC), necesitamos conectarnos a la base de datos de Vercel.
2.  Instala Vercel CLI (si no lo tienes):
    ```bash
    npm i -g vercel
    ```
3.  Conecta tu terminal:
    ```bash
    vercel link
    ```
    *(Sigue las instrucciones: Y, selecciona tu proyecto).*
4.  Descarga las credenciales de la nube a tu PC:
    ```bash
    vercel env pull .env.development.local
    ```
5.  Ahora empuja tu esquema a la nube:
    ```bash
    npx prisma db push
    ```
6.  (Opcional) Carga los datos de prueba (remeras, tablas, etc):
    ```bash
    npx tsx prisma/seed.ts
    ```

¡Listo! Tu tienda Separk debería estar funcionando en `https://separk-shop-tu-usuario.vercel.app`.
