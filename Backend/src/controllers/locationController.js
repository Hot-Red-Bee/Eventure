// controllers/locationController.js
import { PrismaClient } from "@prisma/client";
import { locationSchema } from "../validation/locationValidation.js";

const prisma = new PrismaClient();



// Create location (Admin only)
export const createLocation = async (req, res) => {
  try {
    const { error, value } = locationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const location = await prisma.location.create({ data: value });
    res.status(201).json({ message: "Location created", location });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    await prisma.location.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Location deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
