import { transporterSmtp } from "@/integrations/smtp/setting";

export const getBooleanFilter = (filter: string) => {
  return filter === undefined
    ? undefined
    : String(filter).toLowerCase() === "true";
};

export const checkSmtpConnection = async () => {
  try {
    await transporterSmtp.verify();
    console.log("SMTP: Server is ready to take our messages");
  } catch (err) {
    console.error("SMTP: Verification failed:", err);
  }
};
