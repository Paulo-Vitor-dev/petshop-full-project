const AppointmentModel = require("../models/AppointmentModel");
const PetModel = require("../models/PetModel");
const PetShopServiceModel = require("../models/PetShopServiceModel");

const getAllAppointments = (callback) => {
    AppointmentModel.getAllAppointments(callback);
};

const createAppointment = (appointmentData, callback) => {
    const {
        pet_id,
        service_id,
        appointment_date,
        payment_status
    } = appointmentData;

    if (!pet_id || !service_id || !appointment_date) {
        const error = new Error(
            "Pet, serviço e data do agendamento são obrigatórios"
        );
        error.statusCode = 400;

        return callback(error);
    }

    if (
        payment_status &&
        !["pending", "paid"].includes(payment_status)
    ) {
        const error = new Error(
            "Status de pagamento inválido"
        );
        error.statusCode = 400;

        return callback(error);
    }

    PetModel.getPetById(pet_id, (error, pets) => {
        if (error) {
            return callback(error);
        }

        if (pets.length === 0) {
            const petError = new Error("Pet não encontrado");
            petError.statusCode = 404;

            return callback(petError);
        }

        PetShopServiceModel.getServiceById(
            service_id,
            (error, services) => {
                if (error) {
                    return callback(error);
                }

                if (services.length === 0) {
                    const serviceError = new Error(
                        "Serviço não encontrado"
                    );
                    serviceError.statusCode = 404;

                    return callback(serviceError);
                }

                AppointmentModel.createAppointment(
                    {
                        pet_id,
                        service_id,
                        appointment_date,
                        payment_status,
                    },
                    callback
                );
            }
        );
    });
};

const getAppointmentById = (id, callback) => {
  AppointmentModel.getAppointmentById(id, (error, appointments) => {
    if (error) {
      return callback(error);
    }

    if (appointments.length === 0) {
      const appointmentError = new Error("Agendamento não encontrado");
      appointmentError.statusCode = 404;

      return callback(appointmentError);
    }

    callback(null, appointments[0]);
  });
};

const updateAppointment = (id, appointmentData, callback) => {
  const {
    pet_id,
    service_id,
    appointment_date,
    payment_status,
  } = appointmentData;

  const validPaymentStatuses = ["pending", "paid"];

  if (!validPaymentStatuses.includes(payment_status)) {
    const statusError = new Error("Status de pagamento inválido");
    statusError.statusCode = 400;

    return callback(statusError);
  }

  AppointmentModel.getAppointmentById(id, (error, appointments) => {
    if (error) {
      return callback(error);
    }

    if (appointments.length === 0) {
      const appointmentError = new Error(
        "Agendamento não encontrado"
      );
      appointmentError.statusCode = 404;

      return callback(appointmentError);
    }

    PetModel.getPetById(pet_id, (error, pets) => {
      if (error) {
        return callback(error);
      }

      if (pets.length === 0) {
        const petError = new Error("Pet não encontrado");
        petError.statusCode = 404;

        return callback(petError);
      }

      PetShopServiceModel.getServiceById(
        service_id,
        (error, services) => {
          if (error) {
            return callback(error);
          }

          if (services.length === 0) {
            const serviceError = new Error(
              "Serviço não encontrado"
            );
            serviceError.statusCode = 404;

            return callback(serviceError);
          }

          AppointmentModel.updateAppointment(
            id,
            {
              pet_id,
              service_id,
              appointment_date,
              payment_status,
            },
            callback
          );
        }
      );
    });
  });
};

const deleteAppointment = (id, callback) => {
  AppointmentModel.getAppointmentById(id, (error, appointments) => {
    if (error) {
      return callback(error);
    }

    if (appointments.length === 0) {
      const appointmentError = new Error(
        "Agendamento não encontrado"
      );

      appointmentError.statusCode = 404;

      return callback(appointmentError);
    }

    AppointmentModel.deleteAppointment(id, callback);
  });
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};  