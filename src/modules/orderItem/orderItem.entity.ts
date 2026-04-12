import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from "typeorm"
import { BaseEntity } from "../../shared/entities/base.entity"
import { Product } from "../product/product.entity"
import { Order } from "../order/order.entity"

@Entity("order_items")
@Index(["orderId"])
@Index(["productId"])
export class OrderItem extends BaseEntity {

  @Column({ name: "order_id" })
  orderId!: string

  @ManyToOne(() => Order, order => order.items, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "order_id" })
  order!: Order

  @Column({ name: "product_id" })
  productId!: string

  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: "product_id" })
  product!: Product

  @Column({
    type: 'int'
  })
  quantity!: number

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 10,
    scale: 2
  })
  unitPrice!: number

}