import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import {
  GoogleAccountConflictError,
  GoogleEmailMissingError,
  GoogleEmailNotVerifiedError,
  UserAlreadyExistsError,
} from "../errors/authErrors.js";
import { findOrCreateGoogleUser } from "../services/authService.js";
import { toPublicUser } from "../services/userService.js";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Google authentication failed",
      });
    }

    const { user, isNewUser } = await findOrCreateGoogleUser(req.user);

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


      return res.redirect("http://localhost:5173/dashboard");

  } catch (error) {
    console.error("Google callback error:", error);

    if (error instanceof GoogleEmailMissingError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error instanceof GoogleEmailNotVerifiedError) {
      return res.status(403).json({
        message: error.message,
      });
    }

    if (error instanceof GoogleAccountConflictError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (error instanceof UserAlreadyExistsError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Google login failed",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};