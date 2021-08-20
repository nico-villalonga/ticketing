import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tickex/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";

import { OrderCreatedPublisher } from "../events/publisher/order-created";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_SECONDS = 15 * 60;
const router = Router();

router.post(
  "/api/orders/",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticket id must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();

    if (isReserved) throw new BadRequestError("Ticket already reserved");

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    const order = Order.build({
      userId: req.currentUser.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRoute };
