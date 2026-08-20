const PetModel = require("../models/PetModel");
const ClientModel = require("../models/ClientModel");

const getAllPets = (callback) => {
  PetModel.getAllPets(callback);
};

const getPetById = (id, callback) => {
  PetModel.getPetById(id, callback);
};

const createPet = (petData, callback) => {
  ClientModel.getClientById(petData.client_id, (error, clients) => {
    if (error) {
      return callback(error);
    }

    if (clients.length === 0) {
      const clientError = new Error("Cliente não encontrado");
      clientError.statusCode = 404;

      return callback(clientError);
    }

    PetModel.createPet(petData, callback);
  });
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
};