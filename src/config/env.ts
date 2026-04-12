import { required } from "./required-env";

export const env = {
  dbHost: required("DB_HOST"),
  dbPort: Number(required("DB_PORT")),
  dbUser: required("DB_USER"),
  dbPassword: required("DB_PASSWORD"),
  dbName: required("DB_NAME"),
};
