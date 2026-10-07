import { Router } from "express";
import { authMiddleware } from "../middleware/authmiddleware.js";
import { getCurrentUser, toPublicUser } from "../services/userService.js";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await getCurrentUser(req.userId!);

    return res.json({
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);

    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to get user",
    });
  }
});

export default router;