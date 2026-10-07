import { Router } from "express";
import { authMiddleware } from "../middleware/authmiddleware";

const router = Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
  });
});

export default router;