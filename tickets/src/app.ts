import { currentUser, errorHandler, NotFoundError } from "@tickex/common";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";

import "express-async-errors";
import { createTicketRoute } from "./routes/create";
import { showTicketRoute } from "./routes/show";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createTicketRoute);
app.use(showTicketRoute);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
