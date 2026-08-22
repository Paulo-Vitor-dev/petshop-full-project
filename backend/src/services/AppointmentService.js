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

module.exports = {
    getAllAppointments,
    createAppointment,
};  