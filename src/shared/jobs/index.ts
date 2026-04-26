import { logger } from "@/config";
import { startCancelPendingOrdersJob } from "./cancelPendingOrders.job";
import { removeSpecialCharacters } from "../utils";

export const setupCronScheduleJobs = () => {
   logger.info(`[CRON] StartJobs in ${removeSpecialCharacters(String(new Date()))}`);
  startCancelPendingOrdersJob({ expression:  "0 */1 * * *" });
};
