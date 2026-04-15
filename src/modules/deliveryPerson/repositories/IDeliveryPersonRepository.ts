import { IBaseRepository } from "@/infrastructure/repositories";
import { DeliveryPerson } from "../deliveryPerson.entity";
import { IPaginationList } from "@/shared/interfaces";
import { DeliveryPersonListPaginatedDto } from "../dtos/DeliveryPersonListPaginatedDto";
import { DeliveryPersonResponseDto } from "../dtos/DeliveryPersonResponseDto";

export interface IDeliveryPersonRepository extends IBaseRepository<DeliveryPerson> {
    findAvailable(): Promise<DeliveryPerson[]>; 
    findAllPaginated(params: DeliveryPersonListPaginatedDto): Promise<IPaginationList<DeliveryPersonResponseDto>>
}
