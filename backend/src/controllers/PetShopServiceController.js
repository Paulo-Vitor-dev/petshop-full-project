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

module.exports = {
  getAllServices,
  getServiceById,
  createService,
};