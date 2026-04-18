import { authRoutes } from "@/modules/auth/auth.routes";
import { deliveryPersonsRoutes } from "@/modules/deliveryPerson/deliveryPerson.routes";
import { orderRoutes } from "@/modules/order/order.routes";
import { productRoutes } from "@/modules/product/product.routes";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/delivery-persons", deliveryPersonsRoutes);

export default router;
