import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";

import { NotFoundError } from "./errors/not-found";
import { errorHandler } from "./middlewares/error-handler";
import { currentUserRoute } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRoute } from "./routes/signout";
import { signupRoute } from "./routes/signup";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
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

export { app };
