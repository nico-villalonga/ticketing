import request from "supertest";

import { app } from "../../app";
import { TICKETS_ROUTE } from "../../constants";
import { getAuthCookie } from "../../test/helpers/auth";
import { generateId } from "../../test/helpers/auth";

describe("show route", () => {
  it("should return 404 if ticket is not found", async () => {
    await request(app)
      .get(`${TICKETS_ROUTE}/${generateId()}`)
      .send()
      .expect(404);
  });

  it("should return the ticket when found", async () => {
    const title = "some title";
    const price = 20;

    const response = await request(app)
      .post(TICKETS_ROUTE)
      .set("Cookie", getAuthCookie())
      .send({ title, price })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`${TICKETS_ROUTE}/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
