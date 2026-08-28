const ClientService = require("../services/ClientService");

const getAllClients = (req, res) => {
    ClientService.getAllClients((error, results) => {
        if (error) {
            return res.status(500).json({
                sucess: false,
                message: "Erro ao buscar clientes",
            });
        }

        return res.status(200).json(results);
    });
};

const createClient = (req, res) => {
    const client = req.body;

    ClientService.createClient(client, (error, result) => {
        if (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Já existe um cliente cadastrado com este CPF ou e-mail."
                });
            }

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Erro interno ao cadastrar cliente."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Cliente cadastrado com sucesso.",
            clientId: result.insertId
        });
    });
};

const getClientById = (req, res) => {
  const { id } = req.params;

  ClientService.getClientById(id, (error, results) => {
    if (error) {
      if (error.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Erro interno ao buscar cliente."
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado."
      });
    }

    return res.status(200).json(results[0]);
  });
};

const updateClient = (req, res) => {
  const { id } = req.params;
  const client = req.body;

  ClientService.updateClient(id, client, (error, result) => {
    if (error) {
      if (error.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Já existe um cliente cadastrado com este CPF ou e-mail."
        });
      }

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Erro interno ao atualizar cliente."
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cliente atualizado com sucesso."
    });
  });
};

const deleteClient = (req, res) => {

    const { id } = req.params;

    ClientService.deleteClient(id, (error, result) => {

        if (error) {

            if (error.statusCode === 400) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });

            }

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Erro ao excluir cliente."
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Cliente não encontrado."
            });

        }

        return res.status(200).json({

            success: true,
            message: "Cliente removido com sucesso."

        });

    });

};

const getClientServiceHistory = (req, res) => {
  const { id } = req.params;

  ClientService.getClientServiceHistory(
    id,
    (error, result) => {
      if (error) {
        return res.status(
          error.statusCode || 500
        ).json({
          error: error.message,
        });
      }

      return res.status(200).json(result);
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
};