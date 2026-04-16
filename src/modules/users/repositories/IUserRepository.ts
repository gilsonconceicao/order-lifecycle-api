import { IBaseRepository } from "@/infrastructure/repositories";
import { User } from "../user.entity";

export interface IUserRepository extends IBaseRepository<User> {
      findByEmail(email: string): Promise<User | null>;
}
