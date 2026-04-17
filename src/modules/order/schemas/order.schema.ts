import { OrderStatus } from "@/shared/enums/OrderStatusts"
import { z } from "zod"

export const orderStatusValues = Object.values(OrderStatus); 

export const createOrderSchema = z.object({

  customerName: z.preprocess(
    val => (val ?? "").toString(),
    z.string()
      .min(3, "O nome do cliente deve ter entre 3 e 100 caracteres")
      .max(100, "O nome do cliente deve ter entre 3 e 100 caracteres")
  ),

  customerPhone: z.preprocess(
    val => (val ?? "").toString(),
    z.string()
      .min(8, "O telefone do cliente deve ter entre 8 e 20 caracteres")
      .max(20, "O telefone do cliente deve ter entre 8 e 20 caracteres")
  ),

  deliveryAddress: z.preprocess(
    val => (val ?? "").toString(),
    z.string()
      .min(5, "O endereço de entrega deve ter entre 5 e 300 caracteres")
      .max(300, "O endereço de entrega deve ter entre 5 e 300 caracteres")
  ),

  latitude: z.preprocess(
    val => {
      const num = Number(val)
      return isNaN(num) ? undefined : num
    },
    z.number()
      .refine(val => val !== undefined, "A latitude é obrigatória")
      .min(-90, "Latitude inválida")
      .max(90, "Latitude inválida")
  ),

  longitude: z.preprocess(
    val => {
      const num = Number(val)
      return isNaN(num) ? undefined : num
    },
    z.number()
      .refine(val => val !== undefined, "A longitude é obrigatória")
      .min(-180, "Longitude inválida")
      .max(180, "Longitude inválida")
  ),

  deliveryPersonId: z.preprocess(
    val => (val === undefined || val === null ? null : val.toString()),
     z.string().uuid("ID do entregador inválido").nullable().optional()
  ),

  items: z.array(
    z.object({
      productId: z.string().uuid("ID do produto inválido"),
      quantity: z.preprocess(
        val => Number(val),
        z.number().int("A quantidade deve ser um número inteiro").min(1, "A quantidade mínima é 1")
      )
    })
  ).min(1, "O pedido deve ter pelo menos 1 item")

}).strict()

export const updateOrderSchema = createOrderSchema.partial();