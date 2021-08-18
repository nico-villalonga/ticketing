import { requireAuth, validateRequest } from "@tickex/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/orders/",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticket id must be provided")],
  validateRequest,
  async (_req: Request, res: Response) => {
    res.send({});
  }
);

export { router as createOrderRoute };
