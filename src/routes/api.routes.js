const express = require("express");
const userController = require("../controllers/user.controller");
const eventController = require("../controllers/event.controller");
const paymentDetailController = require("../controllers/payment-detail.controller");
const scheduleController = require("../controllers/schedule.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// API INDEX
router.get("/", (req, res) => {
  res.send("Marriage Story API 2022");
});

// Authentification Routes
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

// User Routes
router.get("/users/profile", authMiddleware, userController.profile);
router.post(
  "/users/profile/update",
  authMiddleware,
  userController.updateProfile
);

// Event Routes
router.get("/events", authMiddleware, eventController.index);
router.get("/events/:eventId", authMiddleware, eventController.show);
router.post(
  "/events/create",
  authMiddleware,
  adminMiddleware,
  eventController.store
);
router.put(
  "/events/update/:eventId",
  authMiddleware,
  adminMiddleware,
  eventController.update
);
router.delete(
  "/events/delete/:eventId",
  authMiddleware,
  adminMiddleware,
  eventController.destroy
);
router.post("/events/join", authMiddleware, eventController.user_join);
router.post("/events/leave", authMiddleware, eventController.user_leave);

// Payment Detail Routes
router.get(
  "/events/:eventId/payments",
  authMiddleware,
  paymentDetailController.index
);
router.get(
  "/events/:eventId/payments/:paymentId",
  authMiddleware,
  paymentDetailController.show
);
router.post(
  "/events/:eventId/payments/create",
  authMiddleware,
  paymentDetailController.store
);
router.put(
  "/events/:eventId/payments/update/:paymentId",
  authMiddleware,
  paymentDetailController.update
);
router.delete(
  "/events/:eventId/payments/delete/:paymentId",
  authMiddleware,
  paymentDetailController.destroy
);

// Schedule Routes
router.get(
  "/events/:eventId/schedules",
  authMiddleware,
  scheduleController.index
);
router.get(
  "/events/:eventId/schedules/:scheduleId",
  authMiddleware,
  scheduleController.show
);
router.post(
  "/events/:eventId/schedules/create",
  authMiddleware,
  scheduleController.store
);
router.put(
  "/events/:eventId/schedules/update/:scheduleId",
  authMiddleware,
  scheduleController.update
);
router.delete(
  "/events/:eventId/schedules/delete/:scheduleId",
  authMiddleware,
  scheduleController.destroy
);

module.exports = router;
