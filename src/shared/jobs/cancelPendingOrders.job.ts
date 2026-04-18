import { AppDataSource } from "@/infrastructure/database/data-source";
import { Order } from "@/modules/order/order.entity";
import { OrderRepository } from "@/modules/order/repositories/OrderRepository";
import { CancelPendingOrdersTask } from "@/modules/order/tasks/CancelPendingOrdersTask";
import cron from "node-cron";

type StartCancelPendingOrdersProps = {
  expression: string;
};

export const startCancelPendingOrdersJob = ({
  expression,
}: StartCancelPendingOrdersProps) => {
  cron.schedule(expression, async () => {
    console.log(`[CRON] Running job StartCancelPendingOrdersJob ${new Date()}`);

    const db = AppDataSource.getRepository(Order);
    const orderRepository = new OrderRepository(db);
    const task = new CancelPendingOrdersTask(orderRepository);

    console.log(
      `[CRON] Finish job StartCancelPendingOrdersJob in ${new Date()}`,
    );
    await task.execute();
  });
};
