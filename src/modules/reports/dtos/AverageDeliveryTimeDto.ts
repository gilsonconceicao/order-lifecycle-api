export interface AverageDeliveryTimeDto {
  averageMinutes: number
  fastestMinutes: number
  slowestMinutes: number
  totalDelivered: number
  byVehicleType?: {
    vehicleType: string
    averageMinutes: number
    count: number
  }[]
}