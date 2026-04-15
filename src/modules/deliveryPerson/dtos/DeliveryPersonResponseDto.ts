import { OrderResponseDto } from "@/modules/order/dtos/OrderResponseDto";
import { VehicleType } from "@/shared/enums/VehicleType";

export class DeliveryPersonResponseDto {
  id!: string;
  name!: string;
  phone!: string;
  vehicleType!: VehicleType;
  isActive!: boolean;
  currentLatitude?: number;
  orders?: OrderResponseDto[];
  createdAt!: Date;
  updatedAt?: Date;
}
