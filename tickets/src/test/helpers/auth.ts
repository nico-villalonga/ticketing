import jwt from "jsonwebtoken";

export const getAuthCookie = () => {
  const payload = {
    id: "123",
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};
