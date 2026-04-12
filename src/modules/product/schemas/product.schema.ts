import { Category } from "@/shared/enums/Category";
import { z } from "zod";

export const categoryEnumValues = Object.values(Category);

export const createProductSchema = z
  .object({
    name: z.preprocess(
      (val) => (val ?? "").toString(),
      z.string()
        .min(3, "O nome deve ter entre 3 e 120 caracteres")
        .max(120, "O nome deve ter entre 3 e 120 caracteres"),
    ),
    description: z.preprocess(
      (val) => (val ?? "").toString(),
      z.string()
        .min(10, "A descrição deve ter entre 10 e 500 caracteres")
        .max(500, "A descrição deve ter entre 10 e 500 caracteres"),
    ),
    price: z.preprocess(
      (val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number()
        .refine((val) => val !== undefined, "O preço é obrigatório")
        .positive("O preço deve ser maior que zero")
        .refine(
          (val) => Number(val.toFixed(2)) === val,
          "O preço deve ter no máximo 2 casas decimais",
        ),
    ),
    category: z.preprocess(
      (val) => (val ?? "").toString(),
      z.string()
        .refine(
          (val) =>
            categoryEnumValues.includes(
              val as (typeof categoryEnumValues)[number],
            ),
          `Escolha uma das opções: ${categoryEnumValues.join(", ")}`,
        ),
    ),
    imageUrl: z.string().url("A imagem deve ser uma URL válida").optional(),
    isAvailable: z.boolean().default(true),
    preparationTime: z.preprocess(
      (val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number()
        .refine((val) => val !== undefined, "O tempo de preparo é obrigatório")
        .int("O tempo de preparo deve ser um número inteiro")
        .min(1, "O tempo mínimo de preparo é 1 minuto")
        .max(120, "O tempo máximo de preparo é 120 minutos"),
    ),
  })
  .strict();

export const updateProductSchema = createProductSchema.partial();
