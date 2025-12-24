// routes/categoryRoutes.js
import express from "express";
import { createCategory, getCategories, deleteCategory } from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;

