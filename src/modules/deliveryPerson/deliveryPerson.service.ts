import { AppError } from "@/shared/errors/Error.helper";
import { DeliveryPerson } from "./deliveryPerson.entity";
import { IDeliveryPersonRepository } from "./repositories/IDeliveryPersonRepository";
import { DeliveryPersonListPaginatedDto } from "./dtos/DeliveryPersonListPaginatedDto";
import { IPaginationList } from "@/shared/interfaces";
import { DeliveryPersonResponseDto } from "./dtos/DeliveryPersonResponseDto";

export class DeliveryPersonService {

  constructor(
    private orderRepository: IDeliveryPersonRepository
  ) {}

  async create(data: Partial<DeliveryPerson>): Promise<DeliveryPerson> {
    return this.orderRepository.create(data);
  }

  async findAll(params: DeliveryPersonListPaginatedDto): Promise<IPaginationList<DeliveryPersonResponseDto>> {
    return await this.orderRepository.findAllPaginated(params);
  }

  async findById(id: string): Promise<DeliveryPerson> {

    const deliveryPerson = await this.orderRepository.findById(id);

    if (!deliveryPerson)
      throw new AppError("DELIVERY_PERSON_NOT_FOUND", "Entregador não encontrado", 404);

    return deliveryPerson;

  }

  async update(id: string, data: Partial<DeliveryPerson>): Promise<DeliveryPerson> {

    const deliveryPerson = await this.orderRepository.findById(id);

    if (!deliveryPerson)
      throw new AppError("DELIVERY_PERSON_NOT_FOUND", "Entregador não encontrado", 404);

    return this.orderRepository.update(id, data);

  }

  async delete(id: string): Promise<void> {

    const deliveryPerson = await this.orderRepository.findById(id);

    if (!deliveryPerson)
      throw new AppError("DELIVERY_PERSON_NOT_FOUND", "Entregador não encontrado", 404);

    await this.orderRepository.delete(id);

  }

}