const PetService = require("../services/PetService");

const getAllPets = (req, res) => {
  PetService.getAllPets((error, results) => {
    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json(results);
  });
};

const getPetById = (req, res) => {
  const { id } = req.params;

  PetService.getPetById(id, (error, results) => {
    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: "Pet não encontrado",
      });
    }

    return res.status(200).json(results[0]);
  });
};

const createPet = (req, res) => {
  const petData = req.body;

  PetService.createPet(petData, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(201).json({
      id: result.insertId,
      ...petData,
    });
  });
};

const updatePet = (req, res) => {
  const { id } = req.params;
  const petData = req.body;

  PetService.updatePet(id, petData, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Pet atualizado com sucesso",
      id: Number(id),
      ...petData,
    });
  });
};

const deletePet = (req, res) => {
  const { id } = req.params;

  PetService.deletePet(id, (error) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Pet excluído com sucesso",
    });
  });
};

const getPetServiceHistory = (req, res) => {
  const { id } = req.params;

  PetService.getPetServiceHistory(
    id,
    (error, result) => {
      if (error) {
        return res.status(
          error.statusCode || 500
        ).json({
          error: error.message,
        });
      }

      return res.status(200).json(result);
    }
  );
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetServiceHistory,
};