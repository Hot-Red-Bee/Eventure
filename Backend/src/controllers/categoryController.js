// controllers/categoryController.js
import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../validation/categoryValidation.js";

const prisma = new PrismaClient();

// Create category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await prisma.category.create({ data: value });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
