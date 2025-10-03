import express from "express";
import {
  createMembership,
  getMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
} from "../controllers/clubMembershipController.js";

const router = express.Router();

router.post("/", createMembership);        // Join a club
router.get("/", getMemberships);           // Get all memberships
router.get("/:id", getMembershipById);     // Get single membership
router.put("/:id", updateMembership);      // Update role
router.delete("/:id", deleteMembership);   // Leave club / remove member

export default router;
