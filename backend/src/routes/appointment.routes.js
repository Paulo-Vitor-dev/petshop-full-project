const express = require("express");
const router = express.Router();

const AppointmentController = require("../controllers/AppointmentController");

router.get("/", AppointmentController.getAllAppointments);
router.post("/", AppointmentController.createAppointment);
router.get("/:id", AppointmentController.getAppointmentById);
router.put("/:id", AppointmentController.updateAppointment);
router.delete("/:id", AppointmentController.deleteAppointment);
router.patch(
    "/:id/status",
    AppointmentController.updateAppointmentStatus
);
router.patch(
    "/:id/payment",
    AppointmentController.updatePaymentStatus
);

module.exports = router;