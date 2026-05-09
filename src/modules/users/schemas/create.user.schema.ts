import { UserRole } from "@/shared/enums/UserRole";
import { z } from "zod";

export const rolesAvailable = Object.values(UserRole);

export const createUserSchema = z
  .object({
    password: z.preprocess(
      (val) => (val ?? "").toString(),
      z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(100, "A senha deve ter no máximo 100 caracteres")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          "A senha deve conter letra maiúscula, minúscula e número",
        ),
    ),

    email: z.preprocess(
      (val) => (val ?? "").toString().trim(),
      z
        .string()
        .email("E-mail inválido")
        .max(255, "O e-mail deve ter no máximo 255 caracteres"),
    ),

   role: z.preprocess(
         (val) => (val ?? "").toString(),
         z.string()
           .refine(
             (val) =>
               rolesAvailable.includes(
                 val as (typeof rolesAvailable)[number],
               ),
             `Escolha uma das opções: ${rolesAvailable.join(", ").toLowerCase()}`,
           ),
       ),
  })
  .strict();

export const updateDeliveryPersonSchema = createUserSchema.partial();
