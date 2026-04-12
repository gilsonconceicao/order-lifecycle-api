import {
  Entity,
  Column,
  Index
} from "typeorm"
import { UserRole } from "../../shared/enums/UserRole"
import { BaseEntity } from "../../shared/entities/base.entity"

@Entity("users")
@Index(["email"])
export class User extends BaseEntity {

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string

  @Column({ type: "varchar", length: 255 })
  password!: string

  @Column({ type: "enum", enum: UserRole })
  role!: UserRole
}