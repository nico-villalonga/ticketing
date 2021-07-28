import request from "supertest";

import { app } from "../../app";
import { getAuthCookie } from "../../test/helpers/auth";

describe("current-user route", () => {
  it("should respond with current user info", async () => {
    const cookie = await getAuthCookie();

    const response = await request(app)
      .get("/api/users/current-user")
      .set("Cookie", cookie)
      .send({})
      .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
  });

  it("should respond with null if not authenticated", async () => {
    const response = await request(app)
      .get("/api/users/current-user")
      .send({})
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});
