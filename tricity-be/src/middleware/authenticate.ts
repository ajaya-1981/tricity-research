import { NextFunction, Request, Response } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("isAuthenticated middleware");
  console.log("req.user", req.user);
  console.log("req.session", req.session);
  console.log("req.isAuthenticated()", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
