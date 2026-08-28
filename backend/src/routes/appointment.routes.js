const express = require("express");
const router = express.Router();

const AppointmentController = require(
    "../controllers/AppointmentController"
);

router.get(
    "/",
    AppointmentController.getAllAppointments
);

router.get(
  "/summary",
  AppointmentController.getAppointmentsSummary
);

router.get(
  "/revenue",
  AppointmentController.getRevenueSummary
);

router.get(
  "/monthly-revenue",
  AppointmentController.getMonthlyRevenue
);

router.get(
  "/service-stats",
  AppointmentController.getServiceStats
);

router.get(
    "/agenda",
    AppointmentController.getDailyAgenda
);

router.get(
    "/:id",
    AppointmentController.getAppointmentById
);

router.post(
    "/",
    AppointmentController.createAppointment
);

router.put(
    "/:id",
    AppointmentController.updateAppointment
);

router.patch(
    "/:id/status",
    AppointmentController.updateAppointmentStatus
);

router.patch(
    "/:id/payment",
    AppointmentController.updatePaymentStatus
);

router.delete(
    "/:id",
    AppointmentController.deleteAppointment
);

module.exports = router;