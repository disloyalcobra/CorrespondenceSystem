import { describe, it, expect } from "vitest";
import { createApp } from "../index";

describe("GET /api/health", () => {
  it("debe responder 200 con { ok: true }", async () => {
    const app = createApp();
    const res = await app.request("/api/health");

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });
});

