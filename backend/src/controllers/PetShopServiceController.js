const PetShopServiceService = require("../services/PetShopServiceService");

const getAllServices = (req, res) => {
  PetShopServiceService.getAllServices((error, services) => {
    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json(services);
  });
};

const getServiceById = (req, res) => {
  const { id } = req.params;

  PetShopServiceService.getServiceById(id, (error, service) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(200).json(service);
  });
};

const createService = (req, res) => {
  const serviceData = req.body;

  PetShopServiceService.createService(serviceData, (error, result) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(201).json({
      id: result.insertId,
      ...serviceData,
    });
  });
};

const updateService = (req, res) => {
  const { id } = req.params;
  const serviceData = req.body;

  PetShopServiceService.updateService(
    id,
    serviceData,
    (error) => {
      if (error) {
        return res.status(error.statusCode || 500).json({
          error: error.message,
        });
      }

      return res.status(200).json({
        message: "Serviço atualizado com sucesso",
        id: Number(id),
        ...serviceData,
      });
    }
  );
};

const deleteService = (req, res) => {
  const { id } = req.params;

  PetShopServiceService.deleteService(id, (error) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Serviço excluído com sucesso",
    });
  });
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};