import { json } from "body-parser";
import express from "express";

import { currentUserRoute } from "./routes/current-user";

const PORT = 3000;
const app = express();
app.use(json());

app.use(currentUserRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
