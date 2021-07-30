import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getAuthCookie } from "../../test/helpers/auth";

const TICKETS_ROUTE = "/api/tickets";

it("should have rotue handler listening for post /api/tickets", async () => {
  const response = await request(app).post(TICKETS_ROUTE).send({});

  expect(response.status).not.toEqual(404);
});

it("should access only if signed in", () => {
  return request(app).post(TICKETS_ROUTE).send().expect(401);
});

it("should return status other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send();

  expect(response.status).not.toEqual(401);
});

it("should return error if invalid title provided", async () => {
  await request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("should return error if invalid price provided", async () => {
  await request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send({
      title: "some title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send({
      title: "some title",
    })
    .expect(400);
});

it("should create ticket with valid inputs", async () => {
  const title = "some  title";
  const price = 20;
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
