# Guía de Despliegue de SegOfi API (Vercel + Turso)

Esta API está construida con **Hono**, **Drizzle ORM** y **libSQL (Turso)**, lista para desplegarse como Serverless Functions en **Vercel**.

---

## 1. Crear Base de Datos en Turso

Instala el CLI de Turso si aún no lo tienes:
```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm https://get.tur.so/install.ps1 | iex
```

Inicia sesión y crea la base de datos:
```bash
turso auth login
turso db create segofi
```

Obtén la URL de conexión y el token de autenticación:
```bash
turso db show segofi --url
turso db tokens create segofi
```

---

## 2. Variables de Entorno en Vercel

Configura las siguientes variables en el panel de **Vercel** (`Settings > Environment Variables`):

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `TURSO_DATABASE_URL` | URL de la base de datos en Turso | `libsql://segofi-org.turso.io` |
| `TURSO_AUTH_TOKEN` | Token de acceso de Turso | `eyJhbGciOi...` |
| `JWT_SECRET` | Llave secreta para firmar sesiones | `clave_secreta_min_32_caracteres` |
| `BLOB_READ_WRITE_TOKEN` | Token de almacenamiento Vercel Blob | `vercel_blob_rw_...` |
| `SEED_ADMIN_EMAIL` | Correo del administrador inicial | `admin@sectur.gob.mx` |
| `SEED_ADMIN_PASSWORD` | Contraseña del administrador inicial | `ContraseñaSegura123!` |
| `SEED_ADMIN_NOMBRE` | Nombre del administrador inicial | `Administrador General` |

---

## 3. Migraciones y Seed en Producción

Aplica el esquema de Drizzle a tu base de datos remota de Turso:
```bash
npx drizzle-kit push
```

Para sembrar los roles, estados y catálogos iniciales en Turso:
```bash
npx tsx api/scripts/seed.ts
```

---

## 4. Despliegue en Vercel

Simplemente conecta tu repositorio de GitHub a Vercel o utiliza el CLI:
```bash
npm install -g vercel
vercel deploy --prod
```
