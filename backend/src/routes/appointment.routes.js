const express = require("express");
const router = express.Router();

const AppointmentController = require("../controllers/AppointmentController");

router.get("/", AppointmentController.getAllAppointments);
router.post("/", AppointmentController.createAppointment);
router.get("/:id", AppointmentController.getAppointmentById);
router.put("/:id", AppointmentController.updateAppointment);
router.delete("/:id", AppointmentController.deleteAppointment);

module.exports = router;