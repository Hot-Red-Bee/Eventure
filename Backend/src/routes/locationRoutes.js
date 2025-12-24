// routes/locationRoutes.js
import express from "express";
import { createLocation, getLocations, deleteLocation } from "../controllers/locationController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createLocation);
router.get("/", getLocations);
router.delete("/:id", protect, adminOnly, deleteLocation);

export default router;
