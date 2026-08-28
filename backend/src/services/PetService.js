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

const updatePet = (id, petData, callback) => {
  PetModel.getPetById(id, (error, pets) => {
    if (error) {
      return callback(error);
    }

    if (pets.length === 0) {
      const petError = new Error("Pet não encontrado");
      petError.statusCode = 404;

      return callback(petError);
    }

    ClientModel.getClientById(petData.client_id, (error, clients) => {
      if (error) {
        return callback(error);
      }

      if (clients.length === 0) {
        const clientError = new Error("Cliente não encontrado");
        clientError.statusCode = 404;

        return callback(clientError);
      }

      PetModel.updatePet(id, petData, callback);
    });
  });
};

const deletePet = (id, callback) => {
  PetModel.getPetById(id, (error, pets) => {
    if (error) {
      return callback(error);
    }

    if (pets.length === 0) {
      const petError = new Error("Pet não encontrado");
      petError.statusCode = 404;

      return callback(petError);
    }

    PetModel.deletePet(id, callback);
  });
};

const getPetServiceHistory = (pet_id, callback) => {
  PetModel.getPetById(pet_id, (error, pets) => {
    if (error) {
      return callback(error);
    }

    if (pets.length === 0) {
      const petError = new Error("Pet não encontrado");
      petError.statusCode = 404;

      return callback(petError);
    }

    PetModel.getPetServiceHistory(
      pet_id,
      (error, history) => {
        if (error) {
          return callback(error);
        }

        return callback(null, {
          pet: {
            id: pets[0].id,
            name: pets[0].name,
          },
          total: history.length,
          history,
        });
      }
    );
  });
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetServiceHistory,
};