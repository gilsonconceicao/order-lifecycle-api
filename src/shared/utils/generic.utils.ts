import { logger } from "@/config";
import { transporterSmtp } from "@/integrations/smtp/setting";

export const getBooleanFilter = (filter: string) => {
  return filter === undefined
    ? undefined
    : String(filter).toLowerCase() === "true";
};