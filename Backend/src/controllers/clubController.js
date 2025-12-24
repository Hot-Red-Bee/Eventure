// controllers/clubController.js
import { PrismaClient } from "@prisma/client";
import { clubSchema } from "../validation/clubValidation.js";

const prisma = new PrismaClient();

// Create club (Admin only)
export const createClub = async (req, res) => {
  try {
    const { error, value } = clubSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const club = await prisma.club.create({
      data: { ...value, createdBy: req.user.id },
    });

    res.status(201).json({ message: "Club created", club });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all clubs
export const getClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({ include: { members: true } });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete club
export const deleteClub = async (req, res) => {
  try {
    await prisma.club.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
