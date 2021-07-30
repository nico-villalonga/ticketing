import { currentUser } from "@tickex/common";
import { Request, Response, Router } from "express";

const router = Router();

router.get(
  "/api/users/current-user",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRoute };
