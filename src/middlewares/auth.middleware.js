const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) throw { status: 401, message: "UNAUTHORIZED" };

    jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          if (err) throw { status: 401, message: "UNAUTHORIZED" };
          const user = await prisma.users.findFirst({
            where: {
              id: decoded.id,
            },
          });

          if (!user) throw { status: 401, message: "UNAUTHORIZED" };
          req.user = user;
          next();
        } catch (error) {
          return res
            .status(error.status || 500)
            .json({ status: false, message: error.message });
        }
      }
    );
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ status: false, message: error.message });
  }
};
