import { Request, Response, NextFunction } from "express";
import { DeliveryPersonService } from "./deliveryPerson.service";
import { getBooleanFilter } from "@/shared/utils";

export class DeliveryPersonController {
  constructor(private deliveryPersonService: DeliveryPersonService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryPerson = await this.deliveryPersonService.create(req.body);

      return res.status(201).json(deliveryPerson);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const deliveryPersons = await this.deliveryPersonService.findAll({
        limit: Number(query?.limit ?? 10),
        page: Number(query?.page ?? 0),
        onlyActive: getBooleanFilter(query?.onlyActive as string)
      });

      return res.json(deliveryPersons);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deliveryPerson = await this.deliveryPersonService.findById(
        id as string,
      );

      return res.json(deliveryPerson);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deliveryPerson = await this.deliveryPersonService.update(
        id as string,
        req.body,
      );

      return res.json(deliveryPerson);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.deliveryPersonService.delete(id as string);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
