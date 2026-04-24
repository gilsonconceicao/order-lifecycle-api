import { logger } from "@/config";
import { startCancelPendingOrdersJob } from "./cancelPendingOrders.job";

export const setupCronJobs = () => {
  logger.info(`[CRON] StartJobs in ${new Date()}`);
  startCancelPendingOrdersJob({ expression: "0 */1 * * *" });
};
