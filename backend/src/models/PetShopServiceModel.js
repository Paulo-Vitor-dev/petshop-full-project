const connection = require("../config/database");

const getAllServices = (callback) => {
  const query = "SELECT * FROM services";

  connection.query(query, callback);
};

const getServiceById = (id, callback) => {
  const query = "SELECT * FROM services WHERE id = ?";

  connection.query(query, [id], callback);
};

const createService = (service, callback) => {
  const query = `
    INSERT INTO services
    (name, price, duration)
    VALUES (?, ?, ?)
  `;

  connection.query(
    query,
    [
      service.name,
      service.price,
      service.duration,
    ],
    callback
  );
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
};