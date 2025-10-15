import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRoutes from "./prisma/src/routes/userRoutes.js";
import eventRoutes from "./prisma/src/routes/eventRoutes.js";
import rsvpRoutes from "./prisma/src/routes/rsvpRoutes.js";
import attendanceRoutes from "./prisma/src/routes/attendanceRoutes.js";
import authRoutes from "./prisma/src/routes/authRoutes.js";
import categoryRoutes from "./prisma/src/routes/categoryRoutes.js";
import locationRoutes from "./prisma/src/routes/locationRoutes.js";
import clubRoutes from "./prisma/src/routes/clubRoutes.js";
import clubMembershipRoutes from "./prisma/src/routes/clubMembershipRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/memberships", clubMembershipRoutes);  

// Base route
app.get("/", (req, res) => {
  res.send("Eventure API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
