import { VehicleType } from "@/shared/enums/VehicleType";
import { z } from "zod";

export const vehicleTypeEnumValues = Object.values(VehicleType);

export const createDeliveryPersonSchema = z.object({
    name: z.preprocess(
      (val) => (val ?? "").toString(),
      z.string()
        .min(3, "O nome deve ter entre 3 e 100 caracteres")
        .max(100, "O nome deve ter entre 3 e 100 caracteres"),
    ),
    phone: z.preprocess(
      (val) => (val ?? "").toString(),
      z.string()
        .min(8, "O telefone deve ter entre 8 e 20 caracteres")
        .max(20, "O telefone deve ter entre 8 e 20 caracteres"),
    ),
    vehicleType: z.preprocess(
      (val) => (val ?? "").toString(),
      z.string()
        .refine(
          (val) =>
            vehicleTypeEnumValues.includes(
              val as (typeof vehicleTypeEnumValues)[number],
            ),
          `Escolha uma das opções: ${vehicleTypeEnumValues.join(", ")}`,
        ),
    ),
    currentLatitude: z.preprocess((val) => {
      if (val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().optional()),
    currentLongitude: z.preprocess((val) => {
      if (val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().optional()),
  })
  .strict();

export const updateDeliveryPersonSchema = createDeliveryPersonSchema.partial();
