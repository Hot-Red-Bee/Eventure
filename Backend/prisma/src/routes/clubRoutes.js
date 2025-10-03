// routes/clubRoutes.js
import express from "express";
import { createClub, getClubs, deleteClub } from "../controllers/clubController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createClub);
router.get("/", getClubs);
router.delete("/:id", protect, adminOnly, deleteClub);

export default router;
