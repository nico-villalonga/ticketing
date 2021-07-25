import { json } from "body-parser";
import express from "express";
import "express-async-errors";

import { NotFoundError } from "./errors/not-found";
import { errorHandler } from "./middlewares/error-handler";
import { currentUserRoute } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRoute } from "./routes/signout";
import { signupRoute } from "./routes/signup";

const PORT = 3000;
const app = express();
app.use(json());

app.use(currentUserRoute);
app.use(signinRouter);
app.use(signoutRoute);
app.use(signupRoute);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
