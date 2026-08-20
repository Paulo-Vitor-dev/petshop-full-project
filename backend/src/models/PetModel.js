const connection = require("../config/database");

const getAllPets = (callback) => {
  const query = "SELECT * FROM pets";

  connection.query(query, callback);
};

const getPetById = (id, callback) => {
  const query = "SELECT * FROM pets WHERE id = ?";

  connection.query(query, [id], callback);
};

const createPet = (pet, callback) => {
  const query = `
    INSERT INTO pets
    (name, species, sex, weight, observations, client_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      pet.name,
      pet.species,
      pet.sex,
      pet.weight,
      pet.observations,
      pet.client_id,
    ],
    callback
  );
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
};