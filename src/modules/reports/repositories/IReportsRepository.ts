import { AverageDeliveryTimeDto, DailyRevenueDto, OrdersByStatusDto, TopProductDto } from "../dtos"

export interface IReportsRepository {

  getRevenue( startDate: string, endDate: string): Promise<DailyRevenueDto[]>

  getOrdersByStatus(): Promise<OrdersByStatusDto[]>

  getTopProducts(startDate?: string, endDate?: string, limit?: number ): Promise<TopProductDto[]>

  getAverageDeliveryTime(startDate?: string,endDate?: string): Promise<AverageDeliveryTimeDto>

}