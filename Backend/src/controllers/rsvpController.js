import prisma from "../config/db.js";
import { rsvpSchema } from "../validation/rsvpValidation.js";
import { sendEmail } from "../utils/sendEmail.js";

// RSVP to Event (Attendees)
export const rsvpEvent = async (req, res) => {
  try {
    const { error, value } = rsvpSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const event = await prisma.event.findUnique({
      where: { id: Number(value.eventId) },
      include: { rsvps: true },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const confirmedCount = event.rsvps.filter((r) => r.status === "confirmed").length;
    const waitlist = confirmedCount >= event.seatLimit;

    const rsvp = await prisma.rsvp.upsert({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: Number(value.eventId),
        },
      },
      update: { status: "confirmed", waitlist, notes: value.notes },
      create: {
        userId: req.user.id,
        eventId: Number(value.eventId),
        status: "confirmed",
        waitlist,
        notes: value.notes,
      },
    });

    // Send confirmation email (best-effort)
    try {
      await sendEmail({
        to: user.email,
        subject: `✅ RSVP Confirmed: ${event.title}`,
        html: `<h2>Hello ${user.name},</h2>
               <p>Your RSVP for <strong>${event.title}</strong> is confirmed${waitlist ? " (you are on the waitlist)" : ""}.</p>
               <p>Date: ${event.date} | Time: ${event.startTime || ""} ${event.endTime ? `- ${event.endTime}` : ""}</p>
               <p>Notes: ${value.notes || "None"}</p>
               <p>Thanks for using Eventure 🎉</p>`,
      });
    } catch (emailErr) {
      // don't fail the request if email fails
      console.error("Failed to send RSVP email:", emailErr);
    }

    res.status(201).json({ message: "RSVP successful", rsvp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Cancel RSVP
export const cancelRsvp = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const rsvp = await prisma.rsvp.updateMany({
      where: { userId: req.user.id, eventId },
      data: { status: "cancelled" },
    });

    res.json({ message: "RSVP cancelled", rsvp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Event RSVPs
export const getEventRsvps = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const rsvps = await prisma.rsvp.findMany({
      where: { eventId },
      include: { user: true },
    });
    res.json(rsvps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
};