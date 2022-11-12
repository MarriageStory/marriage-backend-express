const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      role_name: "Client",
    },
    {
      role_name: "Wedding Organizer",
    },
  ];

  roles.forEach(async (role) => {
    await prisma.roles.create({
      data: role,
    });

    console.log(`Sucess Create Role ${role.role_name}`);
  });
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
