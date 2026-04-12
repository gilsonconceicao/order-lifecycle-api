import { BaseEntity } from "@/shared/entities/base.entity"
import { VehicleType } from "@/shared/enums/VehicleType"
import {
  Entity,
  Column,
  OneToMany,
  Index
} from "typeorm"
import { Order } from "../order/order.entity"

@Entity("delivery_persons")
@Index(["isActive"])
export class DeliveryPerson extends BaseEntity {

  @Column({ type: "varchar", length: 100 })
  name!: string

  @Column({ type: "varchar", length: 20 })
  phone!: string

  @Column({
    name: "vehicle_type",
    type: "enum",
    enum: VehicleType
  })
  vehicleType!: VehicleType

  @Column({
    name: "is_active",
    default: true
  })
  isActive!: boolean

  @Column({
    name: "current_lat",
    type: "decimal",
    precision: 10,
    scale: 8,
    nullable: true
  })
  currentLatitude?: number

  @Column({
    name: "current_lng",
    type: "decimal",
    precision: 11,
    scale: 8,
    nullable: true
  })
  currentLongitude?: number

  @OneToMany(() => Order, order => order.deliveryPerson)
  orders?: Order[]

}