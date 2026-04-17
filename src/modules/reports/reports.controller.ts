import { Request, Response, NextFunction } from "express"
import { ReportsService } from "./reports.service"

export class ReportsController {

  constructor(private reportsService: ReportsService) {}

  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {

      const { startDate, endDate } = req.query

      const result = await this.reportsService.getRevenue(
        startDate as string,
        endDate as string
      )

      return res.json(result)

    } catch (error) {
      next(error)
    }
  }

  async getOrdersByStatus(req: Request, res: Response, next: NextFunction) {
    try {

      const result = await this.reportsService.getOrdersByStatus()

      return res.json(result)

    } catch (error) {
      next(error)
    }
  }

  async getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {

      const { startDate, endDate, limit } = req.query

      const result = await this.reportsService.getTopProducts(
        startDate as string,
        endDate as string,
        Number(limit) || 10
      )

      return res.json(result)

    } catch (error) {
      next(error)
    }
  }

  async getAverageDeliveryTime(req: Request, res: Response, next: NextFunction) {
    try {

      const { startDate, endDate } = req.query

      const result = await this.reportsService.getAverageDeliveryTime(
        startDate as string,
        endDate as string
      )

      return res.json(result)

    } catch (error) {
      next(error)
    }
  }

}