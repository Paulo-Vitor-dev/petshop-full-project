const express = require("express");
const router = express.Router();

const clientRoutes = require("./client.routes");

router.use("/api/clients", clientRoutes);

module.exports = router;