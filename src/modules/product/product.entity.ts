import {
  Entity,
  Column,
  OneToMany,
  Index
} from "typeorm"
import { BaseEntity } from "../../shared/entities/base.entity"
import { OrderItem } from "../orderItem/orderItem.entity"
import { Category } from "../../shared/enums/Category"

@Entity("products")
@Index(["category"])
@Index(["isAvailable"])
@Index(["name"])
@Index(["createdAt"])
@Index(["category", "isAvailable"])
export class Product extends BaseEntity {

  @Column({ type: "varchar", length: 120 })
  name!: string

  @Column({ type: "varchar", length: 500 })
  description!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number

  @Column({ type: "enum", enum: Category })
  category!: Category

  @Column({
    name: "image_url",
    type: "varchar",
    nullable: true
  })
  imageUrl?: string

  @Column({
    name: "is_available",
    default: true
  })
  isAvailable!: boolean

  @Column({
    name: "preparation_time", 
    type: 'int'
  })
  preparationTime!: number

  @OneToMany(() => OrderItem, item => item.product)
  orderItems?: OrderItem[]
}