const express = require("express");
const router = express.Router();

const PetController = require("../controllers/PetController");

router.get("/", PetController.getAllPets);
router.get("/:id", PetController.getPetById);
router.post("/", PetController.createPet);

module.exports = router;