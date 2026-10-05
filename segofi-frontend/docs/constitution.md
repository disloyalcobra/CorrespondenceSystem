# Principios de arquitectura — SegOfi

1. **Stack actual:** React 19, TypeScript, Vite, React Router, Tailwind CSS y lucide-react; seguir `package.json` y la configuración existente.
2. **Modelo de dominio:** `docs/modelo-datos.dbml` y `docs/logica-sistema.md` describen el contrato funcional; cualquier cambio de entidades/estados debe actualizar ambos y acordarse con el backend.
3. **Separación:** vistas en `src/User/` presentan y solicitan acciones; autenticación/autorización sigue en `src/Guards/`; acceso a datos debe encapsularse en servicios tipados.
4. **Persistencia:** los datos reales y las reglas de integridad pertenecen al backend/DB. No tratar mocks ni almacenamiento del navegador como base de datos.
5. **Seguridad:** aplicar autorización en servidor, mínimo privilegio, validación de entradas, contraseñas con hash y auditoría no destructiva.
6. **Compatibilidad:** conservar componentes, rutas, estilos y convenciones TypeScript ya usados en SegOfi; no introducir tecnología paralela sin necesidad.
7. **Idioma:** textos de dominio en español; nombres técnicos y APIs pueden seguir convenciones estándar del ecosistema.
8. **Privacidad:** no incluir datos personales reales, secretos o credenciales en mocks, documentación, logs o repositorio.
