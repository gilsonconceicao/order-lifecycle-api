import { app } from "@/app";
import { generateValidToken } from "@/shared/utils";
import request from "supertest";

describe("Order Status", () => {
  it("deve retornar a listagem atual autorizada de pedidos", async () => {
    const token = generateValidToken();
    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("deve bloquear atualização de status do pedido", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);
    const getFirstOrderId = response?.body?.data[0]?.id;
    
    const updateStatus = await request(app)
      .patch(`/api/orders/${getFirstOrderId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "status-invalido" });

    expect(updateStatus.status).toBe(422);
  });
});
