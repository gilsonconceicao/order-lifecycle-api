import {
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
} from "typeorm";

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async findAll(): Promise<T[]> {
    return this.repository.find({
      order: { createdAt: "DESC" } as unknown as FindOptionsOrder<T>,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error("Entity not found");
    }
    const updated = this.repository.merge(entity, data);
    return this.repository.save(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
