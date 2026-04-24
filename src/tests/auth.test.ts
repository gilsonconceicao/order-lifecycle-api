import request from "supertest";
import { app } from "@/app";
import { generateValidToken } from "@/shared/utils";
import { logger } from "@/config";

describe("Auth", () => {
  it("it should allow access with valid token", async () => {
    const token = generateValidToken();
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).not.toBe(401);
    logger.info(`[Auth] - Token is valid: it worked as expected. `);
  });

  it("it should not allow access with invalid token", async () => {
    const response = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer no token");

    expect(response.status).toBe(401);
    logger.info(`[Auth] - Tokent is invalid: failed as expected. `);
  });
});
