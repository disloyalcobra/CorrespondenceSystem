# Plan 004 — Recuperación y Restablecimiento de Contraseña

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar el flujo completo de "Olvidé mi contraseña" y "Restablecer contraseña" conectando frontend y backend, con tokens criptográficos de un solo uso, expiración a 30 minutos, almacenamiento seguro de hash de token (SHA-256), actualización de `password_hash` con bcrypt y auditoría en base de datos.

**Tech Stack:** TypeScript, React 19, Vite, Tailwind CSS, Lucide Icons, Hono, Drizzle ORM, @libsql/client (Turso), crypto (Node.js/Web Crypto), bcryptjs, zod, Vitest.

---

## Mapa de Archivos

### Backend
- `api/app/db/schema.ts` — Agregar la tabla `tokens_recuperacion`.
- `api/app/db/migrate.ts` — Agregar la instrucción SQL `CREATE TABLE IF NOT EXISTS tokens_recuperacion` para migraciones automáticas.
- `api/app/schemas/recuperarPassword.ts` — Esquemas Zod para validar `forgotPasswordSchema` (`email`) y `resetPasswordSchema` (`token`, `password`).
- `api/app/lib/tokens.ts` — Funciones utilitarias para generación de tokens aleatorios seguros (`generarTokenRecuperacion()`) y cálculo de hash SHA-256 (`hashToken()`).
- `api/app/routes/auth.ts` — Registrar los endpoints:
  - `POST /api/auth/forgot-password`
  - `GET /api/auth/validar-token`
  - `POST /api/auth/reset-password`
- `api/__tests__/recuperar-password.test.ts` — Suite de pruebas unitarias cubriendo solicitud, validación, expiración, consumo único y cambio exitoso de contraseña.

### Frontend
- `src/services/authService.ts` — Extender con:
  - `authService.solicitarRecuperacion(email: string): Promise<{ ok: boolean; mensaje: string; devTokenUrl?: string }>`
  - `authService.validarToken(token: string): Promise<{ valido: boolean; motivo?: string }>`
  - `authService.restablecerPassword(token: string, password: string): Promise<{ ok: boolean; mensaje: string }>`
- `src/Login/ForgotPassword.tsx` — Conectar formulario al servicio real con retroalimentación visual, spinner de carga y mensaje de confirmación institucional.
- `src/Login/ResetPassword.tsx` — Nueva pantalla de restablecimiento de contraseña (`/restablecer-password?token=XYZ`), validaciones de requisitos mínimos de seguridad, confirmación y redirección a login.
- `src/App.tsx` — Registrar la nueva ruta pública `/restablecer-password` con `ResetPassword.tsx`.

---

## Modelo de Datos

```sql
CREATE TABLE IF NOT EXISTS `tokens_recuperacion` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `usuario_id` integer NOT NULL,
  `token_hash` text NOT NULL,
  `expira_en` text NOT NULL,
  `usado` integer DEFAULT 0 NOT NULL,
  `creado_en` text NOT NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_tokens_hash` ON `tokens_recuperacion` (`token_hash`);
```

---

## Decisiones Técnicas y de Seguridad

1. **Almacenamiento de tokens:**
   - Al igual que las contraseñas, los tokens nunca se almacenan en texto plano en la base de datos.
   - Se genera una cadena aleatoria de 32 bytes (`crypto.randomBytes(32).toString('hex')`), la cual se entrega al usuario en el enlace (ej: `/restablecer-password?token=a1b2c3...`).
   - En la base de datos solo se almacena `SHA256(token)`.
2. **Prevención de enumeración de cuentas:**
   - La respuesta ante `POST /api/auth/forgot-password` siempre será exitosa (HTTP 200) con el mismo mensaje descriptivo, evitando que atacantes deduzcan si un correo existe o no en el padrón de la Secretaría.
3. **Manejo de entorno de desarrollo vs producción:**
   - Si no hay un servidor de correo SMTP/Resend configurado en variables de entorno, la API emitirá por consola del servidor el enlace de restablecimiento generado y opcionalmente en el JSON de respuesta cuando `NODE_ENV === "development"`, permitiendo pruebas locales inmediatas.
4. **Vigencia y uso único:**
   - Duración máxima: 30 minutos desde su emisión.
   - Cada token solo puede ser utilizado una única vez (`usado = 1`).
   - Al restablecer la contraseña, se invalidan tokens anteriores del mismo usuario.
5. **Auditoría obligatoria:**
   - Se registra en la tabla `auditoria` el evento institucional con `accion: "password_recuperada"`.
