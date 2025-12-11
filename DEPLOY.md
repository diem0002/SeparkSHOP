# Guía de Despliegue y Administración - Art Gallery

Este documento detalla cómo configurar, desplegar y administrar la aplicación Art Gallery.

## 1. Configuración de Credenciales de Administrador

Para seguridad, las credenciales del usuario administrador no deben estar guardadas en el código. Se configuran mediante variables de entorno.

1.  Abre el archivo `.env` en la raíz del proyecto.
2.  Agrega (o modifica) las siguientes líneas con tus credenciales deseadas:

```env
ADMIN_EMAIL="tu_email_admin@ejemplo.com"
ADMIN_PASSWORD="tu_contraseña_segura"
```

> **Nota**: Si no configuras esto, las credenciales por defecto serán `admin@artgallery.com` / `admin123` (¡No recomendado para producción!).

## 2. Inicialización de la Base de Datos

Cada vez que quieras resetear la base de datos o crear el usuario administrador inicial con las credenciales configuradas:

1.  Abre una terminal en la carpeta del proyecto.
2.  Ejecuta el siguiente comando para limpiar la base de datos (opcional, borra todo):
    ```bash
    npx prisma migrate reset
    ```
3.  Ejecuta el script de "semilla" (seed) para crear el administrador y datos de prueba:
    ```bash
    npx tsx prisma/seed.ts
    ```
    *(Debes tener `DATABASE_URL` configurado en tu .env o usar el valor por defecto en `lib/prisma.ts`)*.

## 3. Despliegue en Producción (Local)

Para ejecutar la aplicación en modo optimizado de producción en lugar de modo desarrollo:

1.  **Construir la aplicación**:
    Esto compila todo el código para que sea rápido.
    ```bash
    npm run build
    ```

2.  **Iniciar el servidor**:
    ```bash
    npm run start
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## 4. Gestión de Usuarios

### Usuario Administrador
-   Puede acceder a `/admin`.
-   Puede subir nuevos cuadros.
-   Puede eliminar cuadros existentes.
-   Para entrar, ve a `/login` y usa las credenciales configuradas en el paso 1.

### Usuario Común
-   Puede registrarse en `/register`.
-   Puede ver la galería en `/gallery` y los detalles de los cuadros.
-   Puede usar el botón de WhatsApp para comprar.
-   **No tiene acceso** al panel de administración.

## 5. Solución de Problemas Comunes

-   **Error de Login**: Asegúrate de haber corrido el script de seed (`npx tsx prisma/seed.ts`).
-   **Puerto ocupado**: Si el puerto 3000 está en uso, cierra otras instancias de Node o reinicia la PC.
-   **Imágenes no cargan**: Asegúrate de que las imágenes subidas estén en `public/uploads`.
