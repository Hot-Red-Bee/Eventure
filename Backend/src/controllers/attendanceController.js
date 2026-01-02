// controllers/attendanceController.js
import prisma from "../config/db.js";
import { attendanceSchema } from "../validation/attendanceValidation.js";

// Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    const { error, value } = attendanceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const attendance = await prisma.attendance.create({ data: value });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

// Get Attendance List
export const getAttendanceList = async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: { eventId },
      include: { user: true },
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance list" });
  }
};
