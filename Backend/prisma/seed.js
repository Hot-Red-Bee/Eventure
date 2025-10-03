const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  //  Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@eventure.com",
      password: "hashedpassword123", //  hash in real app
      role: "admin",
    },
  });

  const attendee = await prisma.user.create({
    data: {
      name: "Student User",
      email: "student@eventure.com",
      password: "hashedpassword123",
      role: "attendee",
    },
  });

  //  Create Category
  const workshop = await prisma.category.create({
    data: {
      name: "Workshop",
      description: "Hands-on learning session",
    },
  });

  //  Create Location
  const hall = await prisma.location.create({
    data: {
      name: "Main Hall",
      description: "The central event hall on campus",
      capacity: 200,
    },
  });

  //  Create Club
  const techClub = await prisma.club.create({
    data: {
      name: "Tech Club",
      description: "Technology enthusiasts and builders",
      contactEmail: "techclub@campus.com",
      createdBy: admin.id,
    },
  });

  //  Create Event
  const event = await prisma.event.create({
    data: {
      title: "Welcome Back Party",
      description: "A fun event to kick off the semester!",
      date: new Date("2025-09-15"),
      startTime: "18:00:00",
      endTime: "21:00:00",
      seatLimit: 100,
      status: "published",
      bannerImage: null,
      createdBy: admin.id,
      categoryId: workshop.id,
      locationId: hall.id,
      clubId: techClub.id,
    },
  });

  //  RSVP by attendee
  await prisma.rsvp.create({
    data: {
      userId: attendee.id,
      eventId: event.id,
      status: "confirmed",
      waitlist: false,
      notes: "Excited to attend!",
    },
  });

  //  Add membership
  await prisma.clubMembership.create({
    data: {
      userId: attendee.id,
      clubId: techClub.id,
      role: "member",
    },
  });

  console.log(" Database seeded successfully with sample data!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
