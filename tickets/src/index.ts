import { app } from "./loaders/app";
import { dbLoader } from "./loaders/db";
import { eventsLoader } from "./loaders/events";

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await eventsLoader();
    await dbLoader();
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
