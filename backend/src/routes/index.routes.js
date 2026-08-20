const express = require("express");
const router = express.Router();

const clientRoutes = require("./client.routes");
const petRoutes = require("./pet.routes");

router.use("/api/clients", clientRoutes);
router.use("/api/pets", petRoutes);

module.exports = router;