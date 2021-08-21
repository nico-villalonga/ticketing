import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  Unauthorized,
} from "@tickex/common";
import { Request, Response, Router } from "express";

import { ORDERS_ROUTE } from "../constants";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  `${ORDERS_ROUTE}/:orderId`,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser.id) throw new Unauthorized();

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRoute };
