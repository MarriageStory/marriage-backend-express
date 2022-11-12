const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  index: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const checkEvent = await prisma.users_events.findFirst({
        where: {
          AND: {
            event_id: Number(eventId),
            user_id: Number(userId),
          },
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const schedules = await prisma.schedules.findMany({
        where: {
          event_id: Number(eventId),
        },
        include: {
          event: {},
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_GET_SCHEDULES",
        data: schedules,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  show: async (req, res) => {
    try {
      const { eventId, scheduleId } = req.params;
      const userId = req.user.id;

      const checkEvent = await prisma.users_events.findFirst({
        where: {
          AND: {
            event_id: Number(eventId),
            user_id: Number(userId),
          },
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const checkSchedule = await prisma.schedules.findFirst({
        where: {
          id: Number(scheduleId),
        },
        include: {
          event: {},
        },
      });

      if (!checkSchedule) {
        throw { status: 404, message: "SCHEDULE_NOT_FOUND" };
      }

      res.status(200).json({
        status: true,
        message: "SUCCESS_GET_SCHEDULE",
        data: checkSchedule,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  store: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const { nama_kegiatan, detail_kegiatan, datetime, tempat } = req.body;

      const checkEvent = await prisma.users_events.findFirst({
        where: {
          AND: {
            event_id: Number(eventId),
            user_id: Number(userId),
          },
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const schedule = await prisma.schedules.create({
        data: {
          nama_kegiatan,
          detail_kegiatan,
          datetime: new Date(datetime),
          tempat,
          event_id: Number(eventId),
        },
      });

      res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_SCHEDULE",
        data: schedule,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { eventId, scheduleId } = req.params;

      const { nama_kegiatan, detail_kegiatan, datetime, tempat } = req.body;

      const checkEvent = await prisma.events.findFirst({
        where: {
          id: Number(eventId),
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const checkSchedule = await prisma.schedules.findFirst({
        where: {
          id: Number(scheduleId),
        },
      });

      if (!checkSchedule) {
        throw { status: 404, message: "SCHEDULE_NOT_FOUND" };
      }

      const schedule = await prisma.schedules.update({
        where: {
          id: Number(scheduleId),
        },
        data: {
          nama_kegiatan,
          detail_kegiatan,
          datetime: new Date(datetime),
          tempat,
          event_id: Number(eventId),
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_SCHEDULE",
        data: schedule,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  destroy: async (req, res) => {
    try {
      const { eventId, scheduleId } = req.params;
      const userId = req.user.id;

      const checkEvent = await prisma.users_events.findFirst({
        where: {
          AND: {
            event_id: Number(eventId),
            user_id: Number(userId),
          },
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const checkSchedule = await prisma.schedules.findFirst({
        where: {
          id: Number(scheduleId),
        },
      });

      if (!checkSchedule) {
        throw { status: 404, message: "SCHEDULE_NOT_FOUND" };
      }

      const schedule = await prisma.schedules.delete({
        where: {
          id: Number(scheduleId),
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_SCHEDULE",
        data: schedule,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
};
