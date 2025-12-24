// routes/rsvpRoutes.js
import express from "express";
import { rsvpEvent, cancelRsvp } from "../controllers/rsvpController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, rsvpEvent);
router.post("/cancel/:id", protect, cancelRsvp);

export default router;
