import { app } from "@/app";
import { logger } from "@/config";
import { ProductCreateDto } from "@/modules/product/dtos/ProductCreteDto";
import { Category } from "@/shared/enums/Category";
import { generateValidToken } from "@/shared/utils";
import request from "supertest";

describe("Products", () => {
  it("deve criar um produto válido", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: Category.SIDE,
        name: "Criado por teste",
        description: `Produto criado por teste no dia em ${new Date().toLocaleDateString("pt-br")}`,
        preparationTime: 10,
        price: 20,
      } as ProductCreateDto);

    const productCreatedId = response.body?.id;

    logger.info(`TEST - Product: produto criado com sucesso ${productCreatedId}`);
    
    await request(app)
    .delete(`/api/products/${productCreatedId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({});
    
    logger.info(`TEST - Product: produto excluído com sucesso ${productCreatedId}`);
    expect(response.status).toBe(201);
  });

  it("deve falhar pois os campos não foram preenchidos", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });
});
