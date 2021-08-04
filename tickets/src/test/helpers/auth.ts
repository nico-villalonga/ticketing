import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getAuthCookie = () => {
  const payload = {
    id: generateId(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};

export const generateId = () => mongoose.Types.ObjectId().toHexString();
