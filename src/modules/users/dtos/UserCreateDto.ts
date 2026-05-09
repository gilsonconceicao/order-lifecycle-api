import { UserRole } from "@/shared/enums/UserRole";

export class UserCreateDto {
  email!: string;
  password!: string;
  role!: UserRole
}