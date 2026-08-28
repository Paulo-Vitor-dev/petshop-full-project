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

const getClientServiceHistory = (client_id, callback) => {
  ClientModel.getClientById(client_id, (error, clients) => {
    if (error) {
      return callback(error);
    }

    if (clients.length === 0) {
      const clientError = new Error("Cliente não encontrado");
      clientError.statusCode = 404;

      return callback(clientError);
    }

    ClientModel.getClientServiceHistory(
      client_id,
      (error, history) => {
        if (error) {
          return callback(error);
        }

        return callback(null, {
          client: {
            id: clients[0].id,
            name: clients[0].name,
          },
          total: history.length,
          history,
        });
      }
    );
  });
};

const getClientsRanking = (filters, callback) => {
  const { start_date, end_date } = filters;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (start_date && !dateRegex.test(start_date)) {
    const error = new Error(
      "A data inicial deve estar no formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    return callback(error);
  }

  if (end_date && !dateRegex.test(end_date)) {
    const error = new Error(
      "A data final deve estar no formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    return callback(error);
  }

  if (start_date && end_date && start_date > end_date) {
    const error = new Error(
      "A data inicial não pode ser maior que a data final"
    );

    error.statusCode = 400;
    return callback(error);
  }

  ClientModel.getClientsRanking(
    {
      start_date,
      end_date,
    },
    (error, results) => {
      if (error) {
        return callback(error);
      }

      const ranking = results.map((client, index) => ({
        position: index + 1,
        client_id: client.client_id,
        client_name: client.client_name,
        appointments: Number(client.appointments) || 0,
        completed_appointments:
          Number(client.completed_appointments) || 0,
        total_spent:
          Number(client.total_spent || 0).toFixed(2),
      }));

      return callback(null, {
        total_clients: ranking.length,
        ranking,
      });
    }
  );
};

module.exports = {
    getAllClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    getClientServiceHistory,
    getClientsRanking
};