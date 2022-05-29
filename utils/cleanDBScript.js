const { PrismaClient } = require("@prisma/client");

const data = require("../data/data.json");
const prisma = new PrismaClient();

async function main() {
  const deleteEvents = await prisma.event.deleteMany({});
  const deleteOrganizers = await prisma.organizer.deleteMany({});

  console.log(`Deleted Events: ${deleteEvents.count}`);
  console.log(`Deleted Organizers: ${deleteOrganizers.count}`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
