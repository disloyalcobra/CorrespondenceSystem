import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireUser, requireRol, hashPassword, verifyPassword } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import { getDb } from "../db/client";
import type { Database } from "../db/client";
import * as schema from "../db/schema";
import type { AppEnv } from "../types";
import {
    crearUsuarioSchema,
    actualizarUsuarioSchema,
    cambiarPasswordSchema,
} from "../schemas/usuario";

const usuariosRouter = new Hono<AppEnv>();

//Helper para limpiar passwordHash de la respuesta
function formatearUsuario(u: typeof schema.usuarios.$inferSelect) {
    return {
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol_id: u.rolId,
        departamento_id: u.departamentoId,
        activo: Boolean(u.activo),
        creado_en: u.creadoEn,
    };
}
//Get /api/usuarios Listado de usuarios
usuariosRouter.get("/", requireRol(2, 3), async (c) => {
    const db: Database = c.get("db") ?? getDb();

    const lista = await db.select().from(schema.usuarios);
    return c.json({ usuarios: lista.map(formatearUsuario) }, 200);
});

//Post /api/usuarios Crear usuario con hash bcryptjs
usuariosRouter.post("/", requireRol(2, 3), async (c) => {
    const admin = await requireUser(c);
    const db: Database = c.get("db") ?? getDb();

    let bodyJson: unknown;
    try {
        bodyJson = await c.req.json();
    } catch {
        throw new ApiError(400, "Cuerpo JSON invalido");
    }
    const parsed = crearUsuarioSchema.safeParse(bodyJson);
    if (!parsed.success) {
        throw new ApiError(422, "Datos de usuario inválidos", parsed.error.format());
    }

    const { nombre, email, password, rol_id, departamento_id } = parsed.data;

    //Verificar que el email no esté duplicado
    const [existente] = await db
        .select()
        .from(schema.usuarios)
        .where(eq(schema.usuarios.email, email.toLocaleLowerCase().trim()))
        .limit(1);

    if (existente) {
        throw new ApiError(409, "El correo electrónico ya se enuentra registrado");
    }
    const passwordHash = await hashPassword(password);
    const ahora = new Date().toISOString();

    const nuevoUsuario = await db.transaction(async (tx) => {
        const [creado] = await tx
            .insert(schema.usuarios)
            .values({
                nombre,
                email: email.toLowerCase().trim(),
                passwordHash,
                rolId: rol_id,
                departamentoId: departamento_id ?? null,
                activo: true,
                creadoEn: ahora,
            })
            .returning();

        await registrar(tx, {
            usuarioId: admin.id,
            accion: "usuario_crear",
            entidad: "usuario",
            entidadId: creado.id,
            detalle: `Usuario creado: ${creado.email}`,
        });
        return creado;
    });
    return c.json({ usuario: formatearUsuario(nuevoUsuario) }, 201);
});

//PUT /api/usuarios/id Actualizacion / Desactivacion logica (roles 2 y 3)
usuariosRouter.put("/:id", requireRol(2, 3), async (c) => {
    const admin = await requireUser(c);
    const id = Number(c.req.param("id"));
    if (!id) throw new ApiError(400, "ID de usaurio inválido");

    const db: Database = c.get("db") ?? getDb();

    let bodyJson: unknown;
    try {
        bodyJson = await c.req.json();
    } catch {
        throw new ApiError(400, "Cuerpo JSON inválido");
    }

    const parsed = actualizarUsuarioSchema.safeParse(bodyJson);
    if (!parsed.success) {
        throw new ApiError(422, "Datos de actualización inválidos", parsed.error.format());
    }
    const data = parsed.data;

    const [usuarioActual] = await db
        .select()
        .from(schema.usuarios)
        .where(eq(schema.usuarios.id, id))
        .limit(1);

    if (!usuarioActual) {
        throw new ApiError(404, "Usuario no encontrado");
    }
    const actualizado = await db.transaction(async (tx) => {
        const updateValues: Partial<typeof schema.usuarios.$inferSelect> = {};
        if (data.nombre !== undefined) updateValues.nombre = data.nombre;
        if (data.email !== undefined) updateValues.email = data.email.toLowerCase().trim();
        if (data.rol_id !== undefined) updateValues.rolId = data.rol_id;
        if (data.departamento_id !== undefined) updateValues.departamentoId = data.departamento_id;
        if (data.activo !== undefined) updateValues.activo = data.activo;

        const [u] = await tx
            .update(schema.usuarios)
            .set(updateValues)
            .where(eq(schema.usuarios.id, id))
            .returning();

        const accion = data.activo == false ? "usuario_desativar" : "usuario_actualiazar";
        await registrar(tx, {
            usuarioId: admin.id,
            accion,
            entidad: "usuario",
            entidadId: id,
            detalle: `Usuario actualizado: ${u.email}`,
        });
        return u;
    });
    return c.json({ usuario: formatearUsuario(actualizado) }, 200);
});

//PUT /api/usuarios/:id/password Cambio de contraseña
usuariosRouter.put("/:id/password", async (c) => {
    const user = await requireUser(c);
    const id = Number(c.req.param("id"));
    if (!id) throw new ApiError(400, "ID de usuario inválido");

    // Solo puede cambiarla el propio usuario o un admin
    const esPropio = user.id == id;
    const esAdmin = [2, 3].includes(user.rol_id);

    if (!esPropio && !esAdmin) {
        throw new ApiError(403, "No autorizado para cambiar la contraseña de otro usuario");
    }

    let bodyJson: unknown;
    try {
        bodyJson = await c.req.json();
    } catch {
        throw new ApiError(400, "Cuerpo JSON inválido");
    }

    const parsed = cambiarPasswordSchema.safeParse(bodyJson);
    if (!parsed.success) {
        throw new ApiError(422, "Datos de cambio de contraseña invalidos", parsed.error.format());
    }

    const { passwordActual, nuevaPassword } = parsed.data;
    const db: Database = c.get("db") ?? getDb();
    const [target] = await db
        .select()
        .from(schema.usuarios)
        .where(eq(schema.usuarios.id, id))
        .limit(1);
    if (!target) {
        throw new ApiError(404, "Usuario no encontrado");
    }
    // Si es auto-servicio (o cualquier cambio sin bypass explícito), validar contraseña actual
    const valida = await verifyPassword(passwordActual, target.passwordHash);
    if (!valida) {
        throw new ApiError(400, "La contraseña actual es incorrecta");
    }
    const nuevaHash = await hashPassword(nuevaPassword);
    await db.transaction(async (tx) => {
        await tx
            .update(schema.usuarios)
            .set({ passwordHash: nuevaHash })
            .where(eq(schema.usuarios.id, id));
        await registrar(tx, {
            usuarioId: user.id,
            accion: "usuario_cambio_password",
            entidad: "usuario",
            entidadId: id,
            detalle: `Cambio de contraseña para usuario ${target.email}`,
        });
    });
    return c.json({ ok: true, mensaje: "Contraseña actualizada exitosamente" }, 200);
});
export default usuariosRouter;
