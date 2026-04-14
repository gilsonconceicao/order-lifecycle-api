import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { getBooleanFilter, getContextUser } from "@/shared/utils";
import { Category } from "@/shared/enums/Category";

export class ProductController {
  constructor(private productService: ProductService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.create(req.body);

      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userContext = getContextUser(req);
      const query = req.query;

      const products = await this.productService.findAll(
        {
          limit: Number(query?.limit ?? 10),
          page: Number(query?.page ?? 0),
          category: query?.category as Category,
          isAvailable: getBooleanFilter(query?.isAvailable as string),
          name: query?.name as string,
        },
        userContext
      );

      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await this.productService.findById(id as string);

      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await this.productService.update(id as string, req.body);

      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.productService.delete(id as string);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
