import request from "supertest";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { generateId, getAuthCookie } from "../../test/helpers/auth";

const ORDERS_ROUTE = "/api/orders";

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
      .send({
        ticketId: ticket.id,
      })
      .expect(400);
  });

  it("should reserve a ticket", async () => {
    const title = "concert";
    const price = 20;
    let orders = await Order.find({});

    expect(orders.length).toEqual(0);

    const ticket = Ticket.build({ title, price });
    await ticket.save();

    const response = await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    orders = await Order.find({});

    expect(orders.length).toEqual(1);
    expect(response.body.ticket.title).toEqual(title);
    expect(response.body.ticket.price).toEqual(price);
  });
});
