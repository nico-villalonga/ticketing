import request from "supertest";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { getAuthCookie } from "../../test/helpers/auth";
import { generateId } from "../../test/helpers/auth";

const TICKETS_ROUTE = "/api/tickets";

const createTicket = (cookie?: string[]) => {
  return request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", cookie || getAuthCookie())
    .send({ title: "some title", price: 20 });
};

describe("update route", () => {
  it("should return 404 if id does not exist", async () => {
    await request(app)
      .put(`${TICKETS_ROUTE}/${generateId()}`)
      .set("Cookie", getAuthCookie())
      .send({ title: "some title", price: 20 })
      .expect(404);
  });

  it("should return 401 if user is not authenticated", async () => {
    await request(app)
      .put(`${TICKETS_ROUTE}/${generateId()}`)
      .send({ title: "some title", price: 20 })
      .expect(401);
  });

  it("should return 401 if user does not own the ticket", async () => {
    const response = await createTicket();

    await request(app)
      .put(`${TICKETS_ROUTE}/${response.body.id}`)
      .send({ title: "some other title", price: 50 })
      .expect(401);
  });

  it("should return 400 if invalid title or price", async () => {
    const cookie = getAuthCookie();
    const response = await createTicket();

    await request(app)
      .put(`${TICKETS_ROUTE}/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 20 })
      .expect(400);

    await request(app)
      .put(`${TICKETS_ROUTE}/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ price: 20 })
      .expect(400);

    await request(app)
      .put(`${TICKETS_ROUTE}/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "some title", price: -20 })
      .expect(400);
  });

  it("should update the ticket successfully", async () => {
    const title = "updated title";
    const price = 25;
    const cookie = getAuthCookie();
    const response = await createTicket(cookie);

    await request(app)
      .put(`${TICKETS_ROUTE}/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(200);

    const ticketResponse = await request(app)
      .get(`${TICKETS_ROUTE}/${response.body.id}`)
      .send();

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });

  it("should publish an event", async () => {
    const title = "updated title";
    const price = 25;
    const cookie = getAuthCookie();
    const response = await createTicket(cookie);

    await request(app)
      .put(`${TICKETS_ROUTE}/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
