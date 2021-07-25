import { Router } from "express";

const router = Router();

router.get("/api/users/current-user", (_req, res) => {
  res.send("Hi there");
});

export { router as currentUserRoute };
