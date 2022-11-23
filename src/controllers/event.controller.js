const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateString } = require("../helpers/utils.helper");

module.exports = {
  index: async (req, res) => {
    try {
      const checkRoleUser = await prisma.users.findFirst({
        where: {
          id: req.user.id,
        },
        include: {
          role: {},
        },
      });

      if (checkRoleUser.role.role_name == "Wedding Organizer") {
        const events = await prisma.events.findMany({
          include: {
            paket: {},
            payment_details: {},
            schedules: {},
          },
        });

        res.status(200).json({
          status: true,
          message: "SUCCESS_GET_EVENTS",
          data: events,
        });
      } else {
        const events = await prisma.events.findMany({
          where: {
            users_events: {
              some: {
                user_id: req.user.id,
              },
            },
          },
          include: {
            paket: {},
            payment_details: {},
            schedules: {},
          },
        });

        res.status(200).json({
          status: true,
          message: "SUCCESS_GET_EVENTS",
          data: events,
        });
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  show: async (req, res) => {
    try {
      const { eventId } = req.params;
      const checkEvent = await prisma.events.findFirst({
        where: {
          id: Number(eventId),
        },
        include: {
          paket: {},
          payment_details: {},
          schedules: {},
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      res.status(200).json({
        status: true,
        message: "SUCCESS_GET_EVENT",
        data: checkEvent,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  store: async (req, res) => {
    try {
      const {
        nama_client,
        datetime,
        tempat,
        total_pembayaran,
        status_pembayaran,
        jumlah_terbayar,
        note,
        paket,
      } = req.body;

      const event = await prisma.events.create({
        data: {
          nama_client,
          datetime: new Date(datetime),
          tempat,
          total_pembayaran: total_pembayaran ? Number(total_pembayaran) : 0,
          status_pembayaran,
          jumlah_terbayar: jumlah_terbayar ? Number(jumlah_terbayar) : 0,
          note,
          gencode: generateString(6),
        },
      });

      if (paket.length == 0) {
        throw { status: 400, message: "PAKET_IS_REQUIRED" };
      }

      // Tambah Paket
      for (var i = 0; i < paket.length; i++) {
        await prisma.paket.create({
          data: {
            event_id: event.id,
            deskripsi: paket[i],
          },
        });
      }

      res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_EVENT",
        data: event,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { eventId } = req.params;
      const {
        nama_client,
        datetime,
        tempat,
        total_pembayaran,
        status_pembayaran,
        jumlah_terbayar,
        note,
        paket,
      } = req.body;

      const checkEvent = await prisma.events.findFirst({
        where: {
          id: Number(eventId),
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const event = await prisma.events.update({
        where: {
          id: Number(eventId),
        },
        data: {
          nama_client,
          datetime: new Date(datetime),
          tempat,
          total_pembayaran: total_pembayaran ? Number(total_pembayaran) : 0,
          status_pembayaran,
          jumlah_terbayar: jumlah_terbayar ? Number(jumlah_terbayar) : 0,
          note,
        },
      });

      // Hapus Semua Paket
      await prisma.paket.deleteMany({
        where: {
          event_id: Number(eventId),
        },
      });

      if (paket.length == 0) {
        throw { status: 400, message: "PAKET_IS_REQUIRED" };
      }

      // Tambah Paket
      for (var i = 0; i < paket.length; i++) {
        await prisma.paket.create({
          data: {
            event_id: event.id,
            deskripsi: paket[i],
          },
        });
      }

      res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_EVENT",
        data: event,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  destroy: async (req, res) => {
    try {
      const { eventId } = req.params;

      const checkEvent = await prisma.events.findFirst({
        where: {
          id: Number(eventId),
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      await prisma.events.delete({
        where: {
          id: Number(eventId),
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_EVENT",
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  user_join: async (req, res) => {
    try {
      const userId = req.user.id;
      const { gencode } = req.body;

      const checkUserJoin = await prisma.users_events.findFirst({
        where: {
          AND: {
            user_id: Number(userId),
          },
        },
      });

      if (checkUserJoin) {
        throw { status: 400, message: "USER_ALREADY_JOIN_EVENT" };
      }

      const checkEvent = await prisma.events.findFirst({
        where: {
          gencode: gencode,
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_GENCODE_NOT_VALID" };
      }

      const userJoin = await prisma.users_events.create({
        data: {
          user_id: Number(userId),
          event_id: checkEvent.id,
        },
      });

      res.status(201).json({
        status: true,
        message: "SUCCESS_JOIN_EVENT",
        data: userJoin,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  user_leave: async (req, res) => {
    try {
      const userId = req.user.id;

      const checkUserJoin = await prisma.users_events.findFirst({
        where: {
          user_id: Number(userId),
        },
      });

      if (!checkUserJoin) {
        throw { status: 400, message: "USER_NOT_JOIN_EVENT" };
      }

      await prisma.users_events.deleteMany({
        where: {
          user_id: Number(userId),
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_LEAVE_EVENT",
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
};
