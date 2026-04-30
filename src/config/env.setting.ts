import { setRequiredEnv } from "@/shared/utils";

export const env = {
  dbHost: setRequiredEnv("DB_HOST"),
  dbPort: Number(setRequiredEnv("DB_PORT")),
  dbUser: setRequiredEnv("DB_USER"),
  dbPassword: setRequiredEnv("DB_PASSWORD"),
  dbName: setRequiredEnv("DB_NAME"),
};
