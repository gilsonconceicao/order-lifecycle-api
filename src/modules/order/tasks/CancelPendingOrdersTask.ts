import { OrderStatus } from "@/shared/enums/OrderStatusts";
import { OrderRepository } from "../repositories/OrderRepository";

export class CancelPendingOrdersTask {
    constructor(private repository: OrderRepository) {}

    async execute (): Promise<void> {
        var orders = await this.repository.findPendingOrdersByMinuteAfterCreated(20); 

        if(orders.length > 0) {
             for (const order of orders) { 
                this.repository.updateStatus(order.id, OrderStatus.CANCELLED);   
            }
        }

        console.log(`[CRON] Cancelled ${orders.length} pending orders`);
    }
}