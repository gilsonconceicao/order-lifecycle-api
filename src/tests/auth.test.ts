import request from "supertest";
import { app } from "@/app";
import { generateValidToken } from "@/shared/utils";

describe("Auth", () => {
  it("deve permitir acesso com token válido", async () => {
    const token = generateValidToken();
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).not.toBe(401);
  });

  it("deve negar acesso com token inválido", async () => {
    const response = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer no token");

    expect(response.status).toBe(401);
  });
});
