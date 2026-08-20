const db = require("../config/database");

class PetModel {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM pets");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      "SELECT * FROM pets WHERE id = ?",
      [id]
    );

    return rows[0];
  }

  static async create(pet) {
    const {
      name,
      species,
      sex,
      weight,
      observations,
      client_id,
    } = pet;

    const [result] = await db.query(
      `INSERT INTO pets
      (name, species, sex, weight, observations, client_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        species,
        sex,
        weight,
        observations,
        client_id,
      ]
    );

    return {
      id: result.insertId,
      ...pet,
    };
  }
}

module.exports = PetModel;