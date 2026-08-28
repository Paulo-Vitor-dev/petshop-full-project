const connection = require("../config/database");
const getAllClients = (callback) => {
    const query = "SELECT * FROM clients";

    connection.query(query, callback);
};

const createClient = (client, callback) => {

    const query = `
        INSERT INTO clients
        (name, cpf, phone, email, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        query,
        [
            client.name,
            client.cpf,
            client.phone,
            client.email,
            client.address
        ],
        callback
    );

};

const getClientById = (id, callback) => {
  const query = "SELECT * FROM clients WHERE id = ?";

  connection.query(query, [id], callback);
};

const updateClient = (id, client, callback) => {
  const query = `
    UPDATE clients
    SET name = ?, cpf = ?, phone = ?, email = ?, address = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      client.name,
      client.cpf,
      client.phone,
      client.email,
      client.address,
      id
    ],
    callback
  );
};

const deleteClient = (id, callback) => {

    const query = `
        DELETE FROM clients
        WHERE id = ?
    `;

    connection.query(
        query,
        [id],
        callback
    );

};

const getClientServiceHistory = (client_id, callback) => {
  const query = `
    SELECT
      appointments.id AS appointment_id,
      appointments.appointment_date,
      appointments.payment_status,
      appointments.appointment_status,

      pets.id AS pet_id,
      pets.name AS pet_name,

      services.id AS service_id,
      services.name AS service_name,
      services.price,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE pets.client_id = ?
      AND appointments.appointment_status = 'completed'

    ORDER BY appointments.appointment_date DESC
  `;

  connection.query(
    query,
    [client_id],
    callback
  );
};

module.exports ={
    getAllClients,    
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    getClientServiceHistory
};

