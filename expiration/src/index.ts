import { eventsLoader } from "./loaders/events";

const start = async () => {
  try {
    await eventsLoader();
  } catch (err) {
    console.error(err);
  }
};

start();
