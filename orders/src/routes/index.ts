import { requireAuth } from "@tickex/common";
import { Request, Response, Router } from "express";

import { ORDERS_ROUTE } from "../constants";
import { Order } from "../models/order";

const router = Router();

router.get(ORDERS_ROUTE, requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser.id }).populate(
    "ticket"
  );

  res.send(orders);
});

export { router as indexOrderRoute };
