# Tasks 004 — Recuperación y Restablecimiento de Contraseña

> Ejecutar en orden. Cada tarea termina con pruebas en verde y commit descriptivo. Leer `specs/004-recuperar-password/spec.md` y `specs/004-recuperar-password/plan.md` antes de comenzar.

---

### Task 1: Modelo de datos y utilidades criptográficas para tokens
**Archivos:**
- Modificar `api/app/db/schema.ts` (tabla `tokensRecuperacion`).
- Modificar `api/app/db/migrate.ts` (SQL para crear tabla e índice).
- Crear `api/app/lib/tokens.ts` (generador de token y hash SHA-256).
- Crear `api/app/schemas/recuperarPassword.ts` (esquemas Zod).

**Paso a paso:**
- [ ] Paso 1: Definir la tabla `tokensRecuperacion` en `schema.ts` con campos `id`, `usuarioId`, `tokenHash`, `expiraEn`, `usado`, `creadoEn`.
- [ ] Paso 2: Agregar el DDL correspondiente en `migrate.ts` para que las migraciones en memoria de los tests y en Turso creen la tabla.
- [ ] Paso 3: Implementar en `lib/tokens.ts` las funciones:
  - `generarTokenHex(): string` (64 caracteres hex / 32 bytes aleatorios).
  - `hashToken(token: string): string` (digest SHA-256 en hex).
- [ ] Paso 4: Crear los esquemas de validación Zod en `schemas/recuperarPassword.ts`:
  - `solicitarRecuperacionSchema` (`email`).
  - `restablecerPasswordSchema` (`token`, `password`).
- [ ] Paso 5: Verificar que compila con `npm run lint` y `npm run build`.

---

### Task 2: Endpoints de backend y suite de pruebas unitarias
**Archivos:**
- Modificar `api/app/routes/auth.ts` (añadir rutas `POST /forgot-password`, `GET /validar-token`, `POST /reset-password`).
- Crear `api/__tests__/recuperar-password.test.ts`.

**Paso a paso:**
- [ ] Paso 1: Escribir pruebas unitarias en `api/__tests__/recuperar-password.test.ts`:
  - `POST /api/auth/forgot-password` con correo existente: genera token y responde 200.
  - `POST /api/auth/forgot-password` con correo inexistente: responde 200 sin revelar inexistencia (anti-enumeración).
  - `GET /api/auth/validar-token` con token válido responde `{ valido: true }`.
  - `GET /api/auth/validar-token` con token expirado responde `{ valido: false }`.
  - `POST /api/auth/reset-password` con token válido y contraseña segura: actualiza `password_hash`, marca token como usado y permite login posterior con la nueva clave.
  - `POST /api/auth/reset-password` intentando reusar el mismo token: devuelve error 400.
  - `POST /api/auth/reset-password` con contraseña débil: devuelve error 422.
- [ ] Paso 2: Implementar la lógica en `api/app/routes/auth.ts`:
  - En `POST /forgot-password`: buscar usuario por email (minúsculas, trim); si existe y está activo, invalidar tokens anteriores no usados, calcular expiración (+30 minutos), insertar en `tokens_recuperacion` y loguear URL para modo desarrollo.
  - En `GET /validar-token`: buscar por `hashToken(token)`; verificar expiración y `usado === false`.
  - En `POST /reset-password`: ejecutar en transacción atómica: verificar token, hashear nueva contraseña con bcrypt (coste 10), actualizar usuario, marcar token usado, auditar con `registrar(tx, { accion: "password_recuperada", ... })`.
- [ ] Paso 3: Ejecutar `npm test -- recuperar-password` y comprobar que todos los tests pasen.
- [ ] Paso 4: Commit `feat(api): endpoints y pruebas para recuperacion y restablecimiento de contraseña`.

---

### Task 3: Servicios en frontend
**Archivos:**
- Modificar `src/services/authService.ts`.

**Paso a paso:**
- [ ] Paso 1: Agregar a `authService`:
  - `solicitarRecuperacion(email: string)`: llamada `POST /auth/forgot-password`.
  - `validarToken(token: string)`: llamada `GET /auth/validar-token?token=...`.
  - `restablecerPassword(token: string, password: string)`: llamada `POST /auth/reset-password`.
- [ ] Paso 2: Exportar los tipos correspondientes de respuesta y carga útil.
- [ ] Paso 3: Verificar compilación con `npm run build`.

---

### Task 4: Integración visual de vistas y navegación
**Archivos:**
- Modificar `src/Login/ForgotPassword.tsx`.
- Crear `src/Login/ResetPassword.tsx`.
- Modificar `src/App.tsx`.

**Paso a paso:**
- [ ] Paso 1: Conectar `src/Login/ForgotPassword.tsx` al servicio `authService.solicitarRecuperacion`, agregando:
  - Manejo de estado de carga con spinner en el botón.
  - Mensaje de confirmación en caso de éxito institucional.
  - Enlace claro para volver al login.
- [ ] Paso 2: Crear el componente `src/Login/ResetPassword.tsx`:
  - Lectura del parámetro `token` desde la URL (`useSearchParams`).
  - Verificación inicial del token al montar la pantalla mediante `authService.validarToken`.
  - Vista amigable en caso de token expirado o inválido con botón "Solicitar nuevo enlace".
  - Formulario con campos "Nueva contraseña" y "Confirmar nueva contraseña" usando `PasswordInput`.
  - Indicador visual de cumplimiento de requisitos (mínimo 8 caracteres, mayúscula, número, símbolo).
  - Manejo de envío con `authService.restablecerPassword` y pantalla de éxito con botón para redirigir a `/login`.
- [ ] Paso 3: Registrar la ruta `/restablecer-password` en `src/App.tsx`.
- [ ] Paso 4: Verificar diseño responsivo, alineación con la paleta de colores institucional (guinda, dorado, neutros) y accesibilidad.

---

### Task 5: Pruebas finales, linting y commit
**Archivos:**
- Todos los modificados.

**Paso a paso:**
- [ ] Paso 1: Ejecutar `npm run lint` y corregir cualquier advertencia de ESLint o hooks.
- [ ] Paso 2: Ejecutar `npm run build` y asegurar que Vite y TypeScript compilen limpiamente.
- [ ] Paso 3: Ejecutar `npm test` verificando que pasen todas las suites anteriores y las nuevas.
- [ ] Paso 4: Probar el flujo completo en el navegador (solicitar correo -> abrir enlace con token -> definir nueva contraseña -> entrar con nueva contraseña).
- [ ] Paso 5: Commit y push a `destino2 main:cambios-diseno`.
