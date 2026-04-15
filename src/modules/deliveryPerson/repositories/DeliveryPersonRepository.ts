import { FindOptionsWhere, IsNull, Repository } from "typeorm";
import { IDeliveryPersonRepository } from "./IDeliveryPersonRepository";
import { BaseRepository } from "@/infrastructure/repositories";
import { DeliveryPerson } from "../deliveryPerson.entity";
import { IPaginationList } from "@/shared/interfaces";
import { DeliveryPersonListPaginatedDto } from "../dtos/DeliveryPersonListPaginatedDto";
import { mapDeliveryPersonToDeliveryResponseDto } from "../mapper/deliveryPerson.mapper";
import { DeliveryPersonResponseDto } from "../dtos/DeliveryPersonResponseDto";

export class DeliveryPersonRepository
  extends BaseRepository<DeliveryPerson>
  implements IDeliveryPersonRepository
{
  constructor(repository: Repository<DeliveryPerson>) {
    super(repository);
  }

  async findAllPaginated(
    params: DeliveryPersonListPaginatedDto,
  ): Promise<IPaginationList<DeliveryPersonResponseDto>> {
    const { limit, page, onlyActive } = params;

    const safePage = Math.max(page, 0);
    const safeLimit = Math.max(limit, 1);

    const skip = safePage * safeLimit;
    const take = safeLimit;
    const where: FindOptionsWhere<DeliveryPerson> = {};

    if (onlyActive) {
      where.isActive = true; 
    }

    const [data, total] = await this.repository.findAndCount({
      order: { updatedAt: "DESC" },
      where,
      take,
      skip,
      relations: {
        orders: true,
      },
    });

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: data.map(mapDeliveryPersonToDeliveryResponseDto),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  async findAll(): Promise<DeliveryPerson[]> {
    return this.repository.find({
      order: { createdAt: "DESC" },
      relations: {
        orders: true,
      },
    });
  }

  async findAvailable(): Promise<DeliveryPerson[]> {
    return await this.repository.find({
      where: { isActive: true, deletedAt: IsNull() },
    });
  }
  async findById(id: string): Promise<DeliveryPerson | null> {
    return await this.repository.findOne({
      where: { id, isActive: true, deletedAt: IsNull() },
      relations: {
        orders: true,
      },
    });
  }
}
