import request from "supertest";

import { app } from "../../app";
import { TICKETS_ROUTE } from "../../constants";
import { getAuthCookie } from "../../test/helpers/auth";

const createTicket = () => {
  return request(app)
    .post(TICKETS_ROUTE)
    .set("Cookie", getAuthCookie())
    .send({ title: "some title", price: 20 });
};

describe("index route", () => {
  it("should fetch a list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get(TICKETS_ROUTE).send().expect(200);

    expect(response.body.length).toEqual(3);
  });
});
