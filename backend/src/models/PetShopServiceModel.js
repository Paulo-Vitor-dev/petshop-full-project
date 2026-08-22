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

const updateService = (id, service, callback) => {
  const query = `
    UPDATE services
    SET name = ?,
        price = ?,
        duration = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      service.name,
      service.price,
      service.duration,
      id,
    ],
    callback
  );
};

const deleteService = (id, callback) => {
  const query = `
    DELETE FROM services
    WHERE id = ?
  `;

  connection.query(query, [id], callback);
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};