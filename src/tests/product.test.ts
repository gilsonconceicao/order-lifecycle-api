import { app } from "@/app";
import { logger } from "@/config";
import { ProductCreateDto } from "@/modules/product/dtos/ProductCreteDto";
import { Category } from "@/shared/enums/Category";
import { generateValidToken } from "@/shared/utils";
import request from "supertest";

describe("Products", () => {
  it("should create a new valid product", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: Category.SIDE,
        name: "Product created by test",
        description: `Product created by jest test in ${new Date().toLocaleDateString("pt-br")}`,
        preparationTime: 10,
        price: 20,
      } as ProductCreateDto);

    const productCreatedId = response.body?.id;

    logger.info(`TEST - Create Product: successfully created product ${productCreatedId}`);
    
    await request(app)
    .delete(`/api/products/${productCreatedId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({});
    
    expect(response.status).toBe(201);
    logger.info(`TEST - Product: The product was successfully deleted ${productCreatedId}`);
  });

  it("should failed because the fields is not filled", async () => {
    const token = generateValidToken();

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    logger.info(`TEST - Invalid fields: failed as expected, fields is not filled`);
  });
});
