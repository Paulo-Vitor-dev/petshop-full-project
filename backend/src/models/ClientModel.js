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

module.exports ={
    getAllClients,    
    createClient,
    getClientById,
    updateClient,
    deleteClient
};

