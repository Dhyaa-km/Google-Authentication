import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const googleUser = req.user as any;

    let user = await User.findOne({
      googleId: googleUser.id,
    });

    if (!user) {
      user = await User.create({
        name: googleUser.displayName,
        email: googleUser.emails[0].value,
        googleId: googleUser.id,
        avatar: googleUser.photos?.[0]?.value,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in with Google",
      user,
    });
  } catch (error) {
    console.error("Google callback error:", error);

    res.status(500).json({
      message: "Google login failed",
    });
  }
};

function googleFailure(req: Request, res: Response) {
    res.status(401).json({ message: 'Google login failed. Please try again.' });
}