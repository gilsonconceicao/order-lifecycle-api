import { startCancelPendingOrdersJob } from "./cancelPendingOrders.job";

export const setupCronJobs = () => {
  console.log(`[CRON] StartJobs in ${new Date()}`);
  startCancelPendingOrdersJob({ expression: "0 */1 * * *" });
};
