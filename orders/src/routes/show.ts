import { NotFoundError, Unauthorized } from "@tickex/common";
import { Request, Response, Router } from "express";

import { ORDERS_ROUTE } from "../constants";
import { Order } from "../models/order";

const router = Router();

router.get(`${ORDERS_ROUTE}/:orderId`, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");

  if (!order) throw new NotFoundError();

  if (order.userId !== req.currentUser.id) throw new Unauthorized();

  res.send(order);
});

export { router as showOrderRoute };
