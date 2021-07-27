import { Request, Response, NextFunction } from "express";

import { Unauthorized } from "../errors/unauthorized";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new Unauthorized();
  }

  next();
};
