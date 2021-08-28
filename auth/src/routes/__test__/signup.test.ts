import request from "supertest";

import { app } from "../../loaders/app";

describe("signup route", () => {
  it("should return 201 on successful signup", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });

  it("should return 400 with invalid email", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test",
        password: "password",
      })
      .expect(400);
  });

  it("should return 400 with invalid password", () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "p",
      })
      .expect(400);
  });

  it("should return 400 with missing email and password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com" })
      .expect(400);

    return request(app)
      .post("/api/users/signup")
      .send({ password: "p" })
      .expect(400);
  });

  it("should disallow duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("should set cookie after successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
