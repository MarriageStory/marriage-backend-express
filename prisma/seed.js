const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      role_name: "Wedding Organizer",
    },
    {
      role_name: "Client",
    },
    {
      role_name: "Admin",
    },
  ];

  roles.forEach(async (role) => {
    await prisma.roles.upsert({
      create: {
        role_name: role.role_name,
      },
      update: {
        role_name: role.role_name,
      },
      where: {
        role_name: role.role_name,
      },
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
