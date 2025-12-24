// routes/eventRoutes.js
import express from "express";
import { createEvent, getEvents, getEventById } from "../controllers/eventController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);

export default router;
