const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.users.findFirst({
      where: {
        id: Number(userId),
      },
      include: {
        role: {},
      },
    });

    if (user.role.role_name != "Admin") {
      throw {
        status: 401,
        message: "UNAUTHORIZED ROLE CAN BE ACCESS ONLY ADMIN",
      };
    }

    next();
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ status: false, message: error.message });
  }
};
