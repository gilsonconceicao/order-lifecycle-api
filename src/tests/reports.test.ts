import { app } from "@/app";
import { generateValidToken } from "@/shared/utils";
import request from "supertest";

describe("Reports", () => {
  it("deve retornar receita no período", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .get("/api/reports/revenue?startDate=2025-01-01&endDate=2025-01-31")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.totalRevenue).toBeDefined();
  });

  it("deve retornar top produtos", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .get("/api/reports/top-products")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
