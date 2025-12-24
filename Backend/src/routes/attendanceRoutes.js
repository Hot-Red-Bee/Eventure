import express from "express";
import { protect, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * NOTE: Replace mock logic with Prisma client calls (e.g. prisma.attendance.*)
 */

/* Create attendance record (any authenticated user) */
router.post("/", protect, async (req, res) => {
  try {
    const { eventId, status = "present", notes = "" } = req.body;
    const userId = req.user?.id;

    // TODO: prisma.attendance.create(...)
    const attendance = {
      id: Date.now(),
      userId,
      eventId,
      status,
      notes,
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json({ message: "Attendance recorded (mock)", attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create attendance" });
  }
});

/* Get attendance for a specific event (admin only) */
router.get("/event/:eventId", protect, requireRole("admin"), async (req, res) => {
  try {
    const { eventId } = req.params;

    // TODO: prisma.attendance.findMany({ where: { eventId: Number(eventId) } })
    const mock = [
      { id: 1, userId: 2, eventId: Number(eventId), status: "present", notes: "", timestamp: "2025-09-15T14:00:00Z" },
    ];

    return res.status(200).json({ eventId: Number(eventId), attendance: mock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch attendance for event" });
  }
});

/* Get attendance for current user (protected) */
router.get("/me", protect, async (req, res) => {
  try {
    const userId = req.user?.id;

    // TODO: prisma.attendance.findMany({ where: { userId } })
    const mock = [
      { id: 1, userId, eventId: 1, status: "present", notes: "Checked in", timestamp: "2025-09-15T14:05:00Z" },
    ];

    return res.status(200).json({ userId, attendance: mock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch your attendance" });
  }
});

/* Mark or update an attendance record (admin) */
router.post("/:id/mark", protect, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // TODO: prisma.attendance.update({ where: { id: Number(id) }, data: { status, notes }})
    const updated = { id: Number(id), status: status || "present", notes: notes || "" };

    return res.status(200).json({ message: "Attendance updated (mock)", attendance: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update attendance" });
  }
});

/* Delete attendance record (admin) */
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    return res.status(200).json({ message: `Attendance ${id} deleted (mock)` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete attendance" });
  }
});

export default router;
