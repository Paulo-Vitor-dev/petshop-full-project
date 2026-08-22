const PetShopServiceModel = require("../models/PetShopServiceModel");

const getAllServices = (callback) => {
  PetShopServiceModel.getAllServices(callback);
};

const getServiceById = (id, callback) => {
  PetShopServiceModel.getServiceById(id, (error, services) => {
    if (error) {
      return callback(error);
    }

    if (services.length === 0) {
      const serviceError = new Error("Serviço não encontrado");
      serviceError.statusCode = 404;

      return callback(serviceError);
    }

    callback(null, services[0]);
  });
};

const createService = (serviceData, callback) => {
  const { name, price, duration } = serviceData;

  if (!name || !name.trim()) {
    const error = new Error("Nome do serviço é obrigatório");
    error.statusCode = 400;

    return callback(error);
  }

  if (price === undefined || price === null || Number(price) <= 0) {
    const error = new Error("Preço deve ser maior que zero");
    error.statusCode = 400;

    return callback(error);
  }

  if (duration === undefined || duration === null || Number(duration) <= 0) {
    const error = new Error("Duração deve ser maior que zero");
    error.statusCode = 400;

    return callback(error);
  }

  PetShopServiceModel.createService(serviceData, callback);
};

const updateService = (id, serviceData, callback) => {
  PetShopServiceModel.getServiceById(id, (error, services) => {
    if (error) {
      return callback(error);
    }

    if (services.length === 0) {
      const serviceError = new Error("Serviço não encontrado");
      serviceError.statusCode = 404;

      return callback(serviceError);
    }

    const { name, price, duration } = serviceData;

    if (!name || !name.trim()) {
      const error = new Error("Nome do serviço é obrigatório");
      error.statusCode = 400;

      return callback(error);
    }

    if (price === undefined || price === null || Number(price) <= 0) {
      const error = new Error("Preço deve ser maior que zero");
      error.statusCode = 400;

      return callback(error);
    }

    if (
      duration === undefined ||
      duration === null ||
      Number(duration) <= 0
    ) {
      const error = new Error("Duração deve ser maior que zero");
      error.statusCode = 400;

      return callback(error);
    }

    PetShopServiceModel.updateService(id, serviceData, callback);
  });
};

const deleteService = (id, callback) => {
  PetShopServiceModel.getServiceById(id, (error, services) => {
    if (error) {
      return callback(error);
    }

    if (services.length === 0) {
      const serviceError = new Error("Serviço não encontrado");
      serviceError.statusCode = 404;

      return callback(serviceError);
    }

    PetShopServiceModel.deleteService(id, callback);
  });
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};