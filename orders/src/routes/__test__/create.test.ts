import request from "supertest";

import { ORDERS_ROUTE } from "../../constants";
import { app } from "../../loaders/app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { generateId, getAuthCookie } from "../../test/helpers/auth";

describe("create route", () => {
  it("should return an error if the ticket does not exist", () => {
    return request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({
        ticketId: generateId(),
      })
      .expect(404);
  });

  it("should return an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
      id: generateId(),
      title: "concert",
      price: 20,
    });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: "123456",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    return request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it("should reserve a ticket", async () => {
    const title = "concert";
    const price = 20;
    let orders = await Order.find({});

    expect(orders.length).toEqual(0);

    const ticket = Ticket.build({ id: generateId(), title, price });
    await ticket.save();

    const response = await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({ ticketId: ticket.id })
      .expect(201);

    orders = await Order.find({});

    expect(orders.length).toEqual(1);
    expect(response.body.ticket.title).toEqual(title);
    expect(response.body.ticket.price).toEqual(price);
  });

  it("should emit an order created event", async () => {
    const title = "concert";
    const price = 20;

    const ticket = Ticket.build({ id: generateId(), title, price });
    await ticket.save();

    await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
