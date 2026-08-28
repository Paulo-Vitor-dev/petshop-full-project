const express = require("express");
const router = express.Router();

const ClientController = require("../controllers/ClientController");

router.get("/", ClientController.getAllClients);
router.get(
  "/:id/history",
  ClientController.getClientServiceHistory
);
router.get("/:id", ClientController.getClientById);
router.post("/", ClientController.createClient);
router.put("/:id", ClientController.updateClient);
router.delete("/:id", ClientController.deleteClient);

module.exports = router;