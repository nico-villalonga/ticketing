import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { generateId, getAuthCookie } from "../../test/helpers/auth";

const ORDERS_ROUTE = "/api/orders";

describe("show route", () => {
  it("should error 404 if order not found", async () => {
    await request(app)
      .get(`${ORDERS_ROUTE}/${generateId()}`)
      .set("Cookie", getAuthCookie())
      .send()
      .expect(404);
  });

  it("should error 401 if user not owns the order", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });

    await ticket.save();

    const { body: order } = await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`${ORDERS_ROUTE}/${order.id}`)
      .set("Cookie", getAuthCookie())
      .send()
      .expect(401);
  });

  it("should fetch user order", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });

    await ticket.save();

    const cookie = getAuthCookie();

    const { body: order } = await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .get(`${ORDERS_ROUTE}/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });
});
