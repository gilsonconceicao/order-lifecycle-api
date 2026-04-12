import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { BaseEntity } from "../../shared/entities/base.entity";
import { OrderStatus } from "../../shared/enums/OrderStatusts";
import { OrderItem } from "../orderItem/orderItem.entity";
import { DeliveryPerson } from "../deliveryPerson/deliveryPerson.entity";

@Entity("orders")
@Index(["status"])
@Index(["createdAt"])
@Index(["deliveryPersonId"])
@Index(["status", "createdAt"])
export class Order extends BaseEntity {
  @Column({ name: "customer_name", length: 100 })
  customerName!: string;

  @Column({ name: "customer_phone", length: 20 })
  customerPhone!: string;

  @Column({ name: "delivery_address", length: 300 })
  deliveryAddress!: string;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: "decimal", precision: 11, scale: 8 })
  longitude!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalAmount!: number;

  @Column({
    name: "delivery_person_id",
    nullable: true,
  })
  deliveryPersonId?: string;

  @ManyToOne(() => DeliveryPerson, (dp) => dp.orders, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "delivery_person_id" })
  deliveryPerson?: DeliveryPerson;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];

  isStatus(value: string): value is OrderStatus {
    return Object.values(OrderStatus).includes(value as OrderStatus);
  }
}
