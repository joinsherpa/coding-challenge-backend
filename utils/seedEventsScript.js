const { PrismaClient } = require("@prisma/client");

const data = require("../data/data.json");
const prisma = new PrismaClient();

async function main() {
    
  for (const { name, isOutside, location, date, organizer } of data) {
    await prisma.event.create({
      data: {
        name: name,
        isOutside: isOutside,
        location: location,
        date: date,
        organizer: {
          connectOrCreate: {
            where: {
              name: organizer.name,
            },
            create: {
              name: organizer.name,
            },
          },
        },
      },
    });
  }

  const allEvents = await prisma.event.findMany({
    include: {
      organizer: true,
    },
  });

  console.log(allEvents);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
