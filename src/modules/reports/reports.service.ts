import { IReportsRepository } from "./repositories/IReportsRepository";

export class ReportsService {
  constructor(private reportsRepository: IReportsRepository) {}

  async getRevenue(startDate: string, endDate: string) {
    const data = await this.reportsRepository.getRevenue(startDate, endDate);

    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

    return {
      startDate,
      endDate,
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      dailyRevenue: data,
    };
  }

  async getOrdersByStatus() {
    const data = await this.reportsRepository.getOrdersByStatus();

    const total = data.reduce((sum, d) => sum + Number(d.count), 0);

    return {
      data,
      total,
    };
  }

  async getTopProducts(startDate?: string, endDate?: string, limit = 10) {
    return {
      data: await this.reportsRepository.getTopProducts(
        startDate,
        endDate,
        limit,
      ),
    };
  }

  async getAverageDeliveryTime(startDate?: string, endDate?: string) {
    return this.reportsRepository.getAverageDeliveryTime(startDate, endDate);
  }
}
