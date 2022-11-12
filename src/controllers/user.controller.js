const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

module.exports = {
  register: async (req, res) => {
    try {
      const { fullname, email, password, role_id } = req.body;

      //   Check Email Duplicated
      const checkEmail = await prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail) {
        throw { status: 400, message: "EMAIL_ALREADY_EXISTS" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await prisma.users.create({
        data: {
          fullname,
          email,
          password: hashPassword,
          role_id: Number(role_id),
        },
        include: {
          role: {},
        },
      });

      const payload = { id: user.id };
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED,
        }
      );

      delete user.password;

      res.status(201).json({
        status: true,
        message: "SUCCESS_REGISTER_USER",
        data: {
          user,
          payload: {
            type: "bearer",
            token: accessToken,
          },
        },
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkEmail = await prisma.users.findFirst({
        where: {
          email,
        },
        include: {
          role: {},
        },
      });

      if (checkEmail) {
        try {
          if (await bcrypt.compare(password, checkEmail.password)) {
            const payload = { id: checkEmail.id };
            const accessToken = jwt.sign(
              payload,
              process.env.JWT_ACCESS_TOKEN_SECRET,
              {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED,
              }
            );

            delete checkEmail.password;

            res.status(200).json({
              status: true,
              message: "SUCCESS_LOGIN_USER",
              data: {
                user: checkEmail,
                payload: {
                  type: "bearer",
                  token: accessToken,
                },
              },
            });
          }
        } catch (error) {
          throw { status: 400, message: "PASSWORD_NOT_MATCH" };
        }
      } else {
        throw { status: 404, message: "EMAIL_NOT_REGISTERED" };
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { fullname } = req.body;
      const userId = req.user.id;

      const user = await prisma.users.update({
        where: {
          id: Number(userId),
        },
        data: {
          fullname,
        },
      });

      delete user.password;

      res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_USER",
        data: {
          user,
        },
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  profile: async (req, res) => {
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

      delete user.password;

      res.status(200).json({
        status: true,
        message: "SUCCESS_GET_USER_PROFILE",
        data: {
          user,
        },
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
};
