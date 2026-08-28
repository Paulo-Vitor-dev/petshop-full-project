const express = require("express");
const router = express.Router();

const clientRoutes = require("./client.routes");
const petRoutes = require("./pet.routes");
const serviceRoutes = require("./service.routes");
const appointmentRoutes = require("./appointment.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use("/api/clients", clientRoutes);
router.use("/api/pets", petRoutes);
router.use("/api/services", serviceRoutes);
router.use("/api/appointments", appointmentRoutes);
router.use("/api/dashboard", dashboardRoutes);

module.exports = router;