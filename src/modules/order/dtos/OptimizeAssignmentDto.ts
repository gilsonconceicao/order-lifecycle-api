export interface AssignmentDTO {
  orderId: string
  deliveryPersonId: string
  estimatedDistanceKm: number
  orderAddress: string
  deliveryPersonName: string
}

export interface UnassignedDTO {
  orderId: string
  orderAddress: string
  reason: string
}

export interface OptimizeAssignmentResponse {
  assignments: AssignmentDTO[]
  unassigned: UnassignedDTO[]
  totalDistanceKm: number
  algorithm: string
  executionTimeMs: number
}