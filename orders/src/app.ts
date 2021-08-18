import { currentUser, errorHandler, NotFoundError } from "@tickex/common";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";

import "express-async-errors";
import { createOrderRoute } from "./routes/create";
import { deleteOrderRoute } from "./routes/delete";
import { indexOrderRoute } from "./routes/index";
import { showOrderRoute } from "./routes/show";

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

app.use(createOrderRoute);
app.use(deleteOrderRoute);
app.use(indexOrderRoute);
app.use(showOrderRoute);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
