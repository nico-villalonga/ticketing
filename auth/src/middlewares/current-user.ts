import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UserPayload } from "../types-modules/express";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) {
    res.send({ currentUser: null });
  }

  next();
};
