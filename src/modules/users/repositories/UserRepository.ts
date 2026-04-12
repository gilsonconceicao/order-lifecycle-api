import { Repository } from "typeorm";
import { IUserRepository } from "./IUserRepository";
import { BaseRepository } from "@/shared/repositories";
import { User } from "../user.entity";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(repository: Repository<User>) {
        super(repository)
    }
    
    findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({where: { email }})
    }
}