import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

if (!token) {
  return res.status(401).json({
    message: "Authentication required",
  });
}

try {
  const decoded = jwt.verify(token, config.JWT_SECRET!);

  console.log("Decoded token:", decoded);

  next();
} catch (error) {
  return res.status(401).json({
    message: "Invalid or expired token",
  });
}
};