import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/orders/", async (_req: Request, res: Response) => {
  res.send({});
});

export { router as indexOrderRoute };
