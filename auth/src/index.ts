import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";

import { NotFoundError } from "./errors/not-found";
import { errorHandler } from "./middlewares/error-handler";
import { currentUserRoute } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRoute } from "./routes/signout";
import { signupRoute } from "./routes/signup";

const PORT = 3000;
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRoute);
app.use(signinRouter);
app.use(signoutRoute);
app.use(signupRoute);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("conected to mongo db");
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
