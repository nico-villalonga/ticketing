import request from "supertest";

import { ORDERS_ROUTE } from "../../constants";
import { app } from "../../loaders/app";
import { Ticket } from "../../models/ticket";
import { generateId, getAuthCookie } from "../../test/helpers/auth";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  return ticket;
};

describe("index route", () => {
  it("should fetch user orders", async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = getAuthCookie();
    const userTwo = getAuthCookie();

    const { body: orderOne } = await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    const { body: orderTwo } = await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", userOne)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    await request(app)
      .post(ORDERS_ROUTE)
      .set("Cookie", userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const response = await request(app)
      .get(ORDERS_ROUTE)
      .set("Cookie", userOne)
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketOne.id);
    expect(response.body[1].ticket.id).toEqual(ticketTwo.id);
  });
});
