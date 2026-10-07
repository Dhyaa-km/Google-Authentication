import { Router } from "express";
import passport from "passport";
import { googleCallback , logout} from "../controllers/authController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    session: false,
  }),
  googleCallback
);

router.get("/failed", (_req, res) => {
  res.status(401).json({
    message: "Google authentication failed",
  });
});

router.post("/logout", logout);

export default router;