const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { multer, upload, deleteFile } = require("../helpers/file.helper");

const store = upload.single("image");

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

      const paymentDetails = await prisma.payment_details.findMany({
        where: {
          event_id: Number(eventId),
        },
        include: {
          event: {},
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_GET_PAYMENT_DETAILS",
        data: paymentDetails,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  show: async (req, res) => {
    try {
      const { eventId, paymentId } = req.params;
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

      const paymentDetail = await prisma.payment_details.findFirst({
        where: {
          AND: {
            id: Number(paymentId),
            event_id: Number(eventId),
          },
        },
        include: {
          event: {},
        },
      });

      if (!paymentDetail) {
        throw { status: 404, message: "PAYMENT_DETAIL_NOT_FOUND" };
      }

      res.status(200).json({
        status: true,
        message: "SUCCESS_GET_PAYMENT_DETAIL",
        data: paymentDetail,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  store: async (req, res) => {
    try {
      store(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).send({
            error: "maximum file size is 2MB",
          });
        } else if (req.fileValidationError) {
          return res.status(400).send({
            error: req.fileValidationError,
          });
        } else if (err) {
          return res.status(400).send({
            error: err,
          });
        }

        try {
          const { eventId } = req.params;
          const userId = req.user.id;

          const { nama_payment, total, datetime, detail } = req.body;

          const checkEvent = await prisma.users_events.findFirst({
            where: {
              AND: {
                event_id: Number(eventId),
                user_id: Number(userId),
              },
            },
            include: {
              events: {},
              users: {},
            },
          });

          if (!checkEvent) {
            throw { status: 404, message: "EVENT_NOT_FOUND" };
          }

          const getTotalPayment = checkEvent.events.jumlah_terbayar;

          let paymentDetail = await prisma.payment_details.create({
            data: {
              nama_payment,
              total: total ? Number(total) : 0,
              datetime: datetime ? new Date(datetime) : new Date(),
              detail,
              event_id: Number(eventId),
            },
          });

          if (req.file) {
            paymentDetail = await prisma.payment_details.update({
              where: {
                id: paymentDetail.id,
              },
              data: {
                image: req.file.path,
              },
            });
          }

          await prisma.events.update({
            where: {
              id: Number(eventId),
            },
            data: {
              jumlah_terbayar: Number(total) + Number(getTotalPayment),
            },
          });

          res.status(201).json({
            status: true,
            message: "SUCCESS_CREATE_PAYMENT_DETAIL",
            data: paymentDetail,
          });
        } catch (error) {
          return res
            .status(error.status || 500)
            .json({ status: false, message: error.message });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      store(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).send({
            error: "maximum file size is 2MB",
          });
        } else if (req.fileValidationError) {
          return res.status(400).send({
            error: req.fileValidationError,
          });
        } else if (err) {
          return res.status(400).send({
            error: err,
          });
        }
        try {
          const { eventId, paymentId } = req.params;
          const userId = req.user.id;

          const { nama_payment, total, datetime, detail } = req.body;

          const checkEvent = await prisma.users_events.findFirst({
            where: {
              AND: {
                event_id: Number(eventId),
                user_id: Number(userId),
              },
            },
            include: {
              events: {},
              users: {},
            },
          });

          if (!checkEvent) {
            throw { status: 404, message: "EVENT_NOT_FOUND" };
          }

          const getTotalPayment = checkEvent.events.jumlah_terbayar;

          const checkPaymentDetail = await prisma.payment_details.findFirst({
            where: {
              id: Number(paymentId),
            },
          });

          if (!checkPaymentDetail) {
            throw { status: 404, message: "PAYMENT_DETAIL_NOT_FOUND" };
          }

          //   Delete Total Payment Before Update
          await prisma.events.update({
            where: {
              id: Number(eventId),
            },
            data: {
              jumlah_terbayar:
                Number(getTotalPayment) - Number(checkPaymentDetail.total),
            },
          });

          let paymentDetail = await prisma.payment_details.update({
            where: {
              id: Number(paymentId),
            },
            data: {
              nama_payment,
              total: total ? Number(total) : 0,
              datetime: datetime ? new Date(datetime) : new Date(),
              detail,
              event_id: Number(eventId),
            },
          });

          if (req.file) {
            if (checkPaymentDetail.image != null) {
              deleteFile(checkPaymentDetail.image);
            }

            paymentDetail = await prisma.payment_details.update({
              where: {
                id: paymentDetail.id,
              },
              data: {
                image: req.file.path,
              },
            });
          }

          await prisma.events.update({
            where: {
              id: Number(eventId),
            },
            data: {
              jumlah_terbayar: Number(total) + Number(getTotalPayment),
            },
          });

          res.status(200).json({
            status: true,
            message: "SUCCESS_UPDATE_PAYMENT_DETAIL",
            data: paymentDetail,
          });
        } catch (error) {
          return res
            .status(error.status || 500)
            .json({ status: false, message: error.message });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
  destroy: async (req, res) => {
    try {
      const { eventId, paymentId } = req.params;
      const userId = req.user.id;

      const checkEvent = await prisma.users_events.findFirst({
        where: {
          AND: {
            event_id: Number(eventId),
            user_id: Number(userId),
          },
        },
        include: {
          events: {},
        },
      });

      if (!checkEvent) {
        throw { status: 404, message: "EVENT_NOT_FOUND" };
      }

      const checkPaymentDetail = await prisma.payment_details.findFirst({
        where: {
          AND: {
            id: Number(paymentId),
          },
        },
      });

      if (!checkPaymentDetail) {
        throw { status: 404, message: "PAYMENT_DETAIL_NOT_FOUND" };
      }

      await prisma.events.update({
        where: {
          id: Number(eventId),
        },
        data: {
          jumlah_terbayar:
            checkEvent.events.jumlah_terbayar - checkPaymentDetail.total,
        },
      });

      if (checkPaymentDetail.image != null) {
        deleteFile(checkPaymentDetail.image);
      }

      const paymentDetail = await prisma.payment_details.delete({
        where: {
          id: Number(paymentId),
        },
      });

      res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_PAYMENT_DETAIL",
        data: paymentDetail,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .json({ status: false, message: error.message });
    }
  },
};
