import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  Unauthorized,
} from "@tickex/common";
import { Request, Response, Router } from "express";

import { Order } from "../models/order";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser.id) throw new Unauthorized();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRoute };
