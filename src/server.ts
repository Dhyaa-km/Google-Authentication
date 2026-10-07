import express from "express";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import"./config/Passport.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

connectDB();

const app = express();
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (_req, res) => {
  res.send("OAuth server is running");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});