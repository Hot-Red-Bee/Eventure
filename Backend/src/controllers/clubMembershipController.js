import {
  createClubMembershipSchema,
  updateClubMembershipSchema,
} from "../validation/clubMembershipValidation.js";

import prisma from "../config/db.js";

/**
 * Create membership (user joins club)
 */
export const createMembership = async (req, res) => {
  try {
    const { error, value } = createClubMembershipSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const membership = await prisma.clubMembership.create({
      data: value,
    });

    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all memberships (with users + clubs)
 */
export const getMemberships = async (req, res) => {
  try {
    const memberships = await prisma.clubMembership.findMany({
      include: { user: true, club: true },
    });
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get membership by ID
 */
export const getMembershipById = async (req, res) => {
  try {
    const membership = await prisma.clubMembership.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, club: true },
    });

    if (!membership)
      return res.status(404).json({ error: "Membership not found" });

    res.json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update membership role (admin can promote/demote)
 */
export const updateMembership = async (req, res) => {
  try {
    const { error, value } = updateClubMembershipSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const membership = await prisma.clubMembership.update({
      where: { id: Number(req.params.id) },
      data: value,
    });

    res.json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete membership (user leaves club or admin removes them)
 */
export const deleteMembership = async (req, res) => {
  try {
    await prisma.clubMembership.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Membership deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
