// controllers/eventController.js
import { PrismaClient } from "@prisma/client";
import { eventSchema } from "../../validation/eventValidation.js";

const prisma = new PrismaClient();



// Create Event (Admin only)
export const createEvent = async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const event = await prisma.event.create({
      data: {
        ...value,
        createdBy: req.user.id,
      },
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }


};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { category: true, location: true, club: true },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get single event
export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, location: true, club: true, rsvps: true },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = eventSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await prisma.event.update({
      where: { id },
      data: value,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

export const eventmail = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, seatLimit, categoryId, locationId } = req.body;

    const event = await prisma.event.create({
      data: {
        title, description, date, startTime, endTime, seatLimit,
        categoryId, locationId,
        createdBy: req.user.id,
      },
    });

    // 📩 Optional: Notify club members if event is linked to a club
    if (event.clubId) {
      const members = await prisma.clubMembership.findMany({
        where: { clubId: event.clubId },
        include: { user: true },
      });

      for (const member of members) {
        await sendEmail({
          to: member.user.email,
          subject: `🎉 New Event: ${event.title}`,
          html: `<h2>Hi ${member.user.name},</h2>
                 <p>A new event <b>${event.title}</b> has been created by your club.</p>
                 <p>Date: ${event.date} | Time: ${event.startTime} - ${event.endTime}</p>
                 <p>Don’t miss it!</p>`,
        });
      }
    }

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const cancelEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.update({
      where: { id: Number(eventId) },
      data: { status: "CANCELLED" },
    });

    // 📩 Notify all RSVPs
    const rsvps = await prisma.rsvp.findMany({
      where: { eventId: event.id, status: "CONFIRMED" },
      include: { user: true },
    });

    for (const rsvp of rsvps) {
      await sendEmail({
        to: rsvp.user.email,
        subject: `❌ Event Cancelled: ${event.title}`,
        html: `<h2>Hello ${rsvp.user.name},</h2>
               <p>We’re sorry to inform you that <b>${event.title}</b> has been cancelled.</p>
               <p>We’ll keep you updated on future events!</p>`,
      });
    }

    res.status(200).json({ message: "Event cancelled and users notified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
