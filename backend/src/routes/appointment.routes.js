const express = require("express");
const router = express.Router();

const AppointmentController = require("../controllers/AppointmentController");

router.get("/", AppointmentController.getAllAppointments);
router.post("/", AppointmentController.createAppointment);

module.exports = router;