const ClientModel = require("../models/ClientModel");

const getAllClients = (callback) => {
    ClientModel.getAllClients(callback);
};

const createClient = (client, callback) => {
  const requiredFields = [
    client.name,
    client.cpf,
    client.phone,
    client.email
  ];

  const hasEmptyField = requiredFields.some(
    (field) => !field || field.trim() === ""
  );

  if (hasEmptyField) {
    const error = new Error(
      "Nome, CPF, telefone e e-mail são obrigatórios."
    );

    error.statusCode = 400;

    return callback(error);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(client.email)) {
  const error = new Error("Informe um e-mail válido.");

  error.statusCode = 400;

  return callback(error);
}

  ClientModel.createClient(client, callback);
};

const getClientById = (id, callback) => {
  if (!id || Number.isNaN(Number(id))) {
    const error = new Error("ID do cliente inválido.");
    error.statusCode = 400;

    return callback(error);
  }

  ClientModel.getClientById(id, callback);
};

const updateClient = (id, client, callback) => {
  if (!id || Number.isNaN(Number(id))) {
    const error = new Error("ID do cliente inválido.");
    error.statusCode = 400;

    return callback(error);
  }

  const requiredFields = [
    client.name,
    client.cpf,
    client.phone,
    client.email
  ];

  const hasEmptyField = requiredFields.some(
    (field) => !field || field.trim() === ""
  );

  if (hasEmptyField) {
    const error = new Error(
      "Nome, CPF, telefone e e-mail são obrigatórios."
    );

    error.statusCode = 400;

    return callback(error);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(client.email)) {
    const error = new Error("Informe um e-mail válido.");
    error.statusCode = 400;

    return callback(error);
  }

  ClientModel.updateClient(id, client, callback);
};

const deleteClient = (id, callback) => {

    if (!id || Number.isNaN(Number(id))) {

        const error = new Error("ID do cliente inválido.");
        error.statusCode = 400;

        return callback(error);

    }

    ClientModel.deleteClient(id, callback);

};

module.exports = {
    getAllClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient
};