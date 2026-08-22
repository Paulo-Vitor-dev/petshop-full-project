const express = require("express");
const router = express.Router();

const PetShopServiceController = require("../controllers/PetShopServiceController");

router.get("/", PetShopServiceController.getAllServices);
router.get("/:id", PetShopServiceController.getServiceById);
router.post("/", PetShopServiceController.createService);

module.exports = router;