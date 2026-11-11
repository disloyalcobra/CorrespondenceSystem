# Especificación 004 — Recuperación y Restablecimiento de Contraseña (SegOfi)

## Objetivo
Proveer un flujo seguro, institucional y confiable para que los usuarios de SegOfi que hayan olvidado su contraseña puedan solicitar su recuperación y definir una nueva contraseña, cumpliendo con los estándares de seguridad gubernamentales y protegiendo al sistema contra enumeración de cuentas, ataques de fuerza bruta y reutilización de tokens.

---

## Actores
- **Usuario institucional:** Cualquier funcionario con cuenta activa en SegOfi que no recuerde su contraseña o requiera restablecerla.
- **Sistema (API SegOfi):** Genera tokens criptográficamente seguros con vigencia finita, valida la integridad y expiración del token, hashea la nueva contraseña con bcrypt, actualiza la base de datos de manera atómica y audita la acción.

---

## Flujo de Negocio

1. **Solicitud de recuperación (`/recuperar-password`):**
   - El usuario introduce su correo institucional (`@puebla.gob.mx` o registrado).
   - El sistema valida el formato del correo y emite una respuesta genérica uniforme ("Si el correo se encuentra registrado, recibirás un enlace de restablecimiento"), protegiendo al sistema contra enumeración de cuentas activas.
   - Si la cuenta existe y está activa:
     - Se invalida cualquier token de recuperación previo no utilizado del usuario.
     - Se genera un token criptográfico seguro (32 bytes aleatorios).
     - Se almacena el hash SHA-256 del token en la base de datos junto con su fecha de expiración (vigencia de 30 minutos) y estado `usado = false`.
     - En producción, se envía por correo electrónico; en entorno local/desarrollo, se registra el enlace en consola y registros del servidor.

2. **Validación de token de restablecimiento (`/restablecer-password?token=XYZ`):**
   - El usuario abre el enlace recibido.
   - El frontend contacta al backend para comprobar la validez del token antes de presentar el formulario.
   - Si el token expiró, ya fue usado o no existe, se muestra un mensaje informativo y un botón para volver a solicitarlo.

3. **Definición de nueva contraseña:**
   - El usuario introduce la nueva contraseña y su confirmación.
   - Se validan los requisitos mínimos institucionales de seguridad (mínimo 8 caracteres, al menos una mayúscula, un número y un caracter especial).
   - El backend verifica el token, genera el nuevo hash con `bcryptjs` (salt rounds = 10), actualiza `password_hash` del usuario, marca el token como consumido (`usado = true`) y registra el evento en la tabla `auditoria`.
   - Se confirma al usuario el éxito de la operación y se le redirige al inicio de sesión (`/login`).

---

## Requisitos Funcionales

### RF-1: Solicitud de restablecimiento
- Endpoint `POST /api/auth/forgot-password`.
- Recibe `{ email: string }`.
- Validación Zod del formato de correo electrónico.
- Respuesta invariable con código HTTP 200 y mensaje neutro, indistintamente de si el correo existe o no en la base de datos (anti-enumeración).

### RF-2: Generación y persistencia de tokens de recuperación
- Nueva tabla `tokens_recuperacion` en el esquema Drizzle con las columnas:
  - `id`: integer autoincremental primario.
  - `usuario_id`: foreign key a `usuarios.id`.
  - `token_hash`: text único (hash SHA-256 del token original).
  - `expira_en`: text (formato ISO-8601 UTC).
  - `usado`: integer boolean (default false).
  - `creado_en`: text (formato ISO-8601 UTC).
- Vigencia de 30 minutos desde su generación.

### RF-3: Verificación de token
- Endpoint `GET /api/auth/validar-token?token=XYZ`.
- Calcula el hash SHA-256 del token provisto y busca la coincidencia activa en la base de datos.
- Responde `{ valido: true }` si existe, `usado = false` y `expira_en > ahora`; de lo contrario, responde `{ valido: false, motivo: "expirado" | "invalido" | "usado" }`.

### RF-4: Restablecimiento de contraseña
- Endpoint `POST /api/auth/reset-password`.
- Recibe `{ token: string, password: string }`.
- Reglas de validación de contraseña:
  - Mínimo 8 caracteres.
  - Al menos 1 letra mayúscula (`[A-Z]`).
  - Al menos 1 número (`[0-9]`).
  - Al menos 1 símbolo especial (`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`).
- Proceso transaccional atómico:
  1. Validar que el token existe, no ha sido usado y no ha expirado.
  2. Hashear la nueva contraseña con `bcryptjs` (coste 10).
  3. Actualizar `password_hash` en la tabla `usuarios`.
  4. Marcar el token como `usado = true`.
  5. Invalidar cualquier otra sesión activa o token pendiente del usuario.
  6. Insertar registro en la tabla `auditoria` con `accion: "password_recuperada"`.

### RF-5: Interfaces de usuario
- Actualización de [ForgotPassword.tsx](file:///d:/Proyectos/FucionCorrespondencia/SegOfi/SegOfi-Sectur/segofi-frontend/src/Login/ForgotPassword.tsx) para conectarlo al endpoint real con estados de carga, confirmación y manejo de errores.
- Creación de la nueva vista `src/Login/ResetPassword.tsx` para la ruta `/restablecer-password` con:
  - Indicador de fortaleza de contraseña.
  - Campos de nueva contraseña y confirmación con visualización de visibilidad (ojo mostrar/ocultar).
  - Estados visuales: token inválido/expirado, cargando, y éxito con botón para ir a login.

---

## Requisitos No Funcionales
- **Seguridad Criptográfica:** El token en texto plano nunca se almacena en la base de datos; solo se guarda su hash SHA-256.
- **Protección contra Fuerza Bruta:** Tokens de al menos 256 bits de entropía (32 bytes hex).
- **Consumo Único (Single-Use):** Una vez utilizado un token para cambiar la contraseña, queda invalidado permanentemente.
- **Integridad y Auditoría:** Cada cambio de contraseña genera un registro no repudiable en la tabla `auditoria`.
- **Compatibilidad:** Mantiene la arquitectura monolítica Vercel + Turso + React Router.

---

## Casos Límite
1. **Token expirado:** El usuario intenta abrir el enlace después de 30 minutos; el sistema rechaza la solicitud e invita a solicitar un nuevo enlace.
2. **Reuso de token:** Un usuario o atacante intenta reenviar el mismo token después de un cambio exitoso; el backend responde con error 400 "Token inválido o ya utilizado".
3. **Usuario inactivo:** Si la cuenta fue desactivada por administración (`activo = false`), la solicitud de recuperación no genera tokens ni permite el restablecimiento.
4. **Contraseña idéntica a la anterior:** El backend puede aceptar el cambio o alertar según la política, pero siempre actualiza el hash con una nueva sal.
5. **Múltiples solicitudes consecutivas:** Si el usuario solicita el restablecimiento 3 veces seguidas, cada nueva solicitud invalida los tokens anteriores para evitar colisiones.

---

## Criterios de Aceptación
1. `POST /api/auth/forgot-password` emite la respuesta neutra esperada y persiste el token si el correo existe.
2. `POST /api/auth/reset-password` actualiza exitosamente el hash de la contraseña en la base de datos y marca el token como consumido.
3. El usuario puede iniciar sesión inmediatamente con la nueva contraseña en `/login`.
4. El intento de iniciar sesión con la contraseña anterior falla con 401.
5. La suite de pruebas de Vitest incluye tests unitarios para todo el ciclo de vida del token (generación, expiración, reuso y restablecimiento).
6. `npm run lint`, `npm run build` y `npm test` finalizan con 0 errores.
