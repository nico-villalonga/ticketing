import { Request, Response, Router } from "express";

const router = Router();

router.delete("/api/orders/:orderId", async (_req: Request, res: Response) => {
  res.send({});
});

export { router as deleteOrderRoute };
