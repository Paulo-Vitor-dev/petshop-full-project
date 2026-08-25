const AppointmentModel = require("../models/AppointmentModel");
const PetModel = require("../models/PetModel");
const PetShopServiceModel = require("../models/PetShopServiceModel");

const validateAppointmentDate = (appointment_date) => {
    const appointmentDate = new Date(appointment_date);
    const now = new Date();

    if (Number.isNaN(appointmentDate.getTime())) {
        const error = new Error("Data do agendamento inválida");
        error.statusCode = 400;

        return error;
    }

    if (appointmentDate <= now) {
        const error = new Error(
            "O agendamento deve ser realizado para uma data futura"
        );

        error.statusCode = 400;

        return error;
    }

    const dayOfWeek = appointmentDate.getDay();

    if (dayOfWeek === 0) {
        const error = new Error(
            "Não realizamos atendimentos aos domingos"
        );

        error.statusCode = 400;

        return error;
    }

    const hour = appointmentDate.getHours();

    if (hour < 8 || hour >= 18) {
        const error = new Error(
            "O horário do agendamento deve estar entre 08:00 e 18:00"
        );

        error.statusCode = 400;

        return error;
    }

    return null;
};

const validateAppointmentEndTime = (appointment_date, duration) => {
    const appointmentDate = new Date(appointment_date);

    const endDate = new Date(
        appointmentDate.getTime() + duration * 60 * 1000
    );

    const closingDate = new Date(appointmentDate);
    closingDate.setHours(18, 0, 0, 0);

    if (endDate > closingDate) {
        const error = new Error(
            "O atendimento deve terminar até às 18:00"
        );

        error.statusCode = 400;

        return error;
    }

    return null;
};

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

    const dateError = validateAppointmentDate(appointment_date);

    if (dateError) {
        return callback(dateError);
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

                const duration = services[0].duration;

                const endTimeError = validateAppointmentEndTime(
                    appointment_date,
                    duration
                );

                if (endTimeError) {
                    return callback(endTimeError);
                }

                AppointmentModel.checkPetScheduleConflict(
                    pet_id,
                    appointment_date,
                    duration,
                    (error, conflicts) => {
                        if (error) {
                            return callback(error);
                        }

                        if (conflicts.length > 0) {
                            const conflictError = new Error(
                                "O pet já possui um agendamento neste período"
                            );

                            conflictError.statusCode = 409;

                            return callback(conflictError);
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
            }
        );
    });
};

const getAppointmentById = (id, callback) => {
    AppointmentModel.getAppointmentById(
        id,
        (error, appointments) => {
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

            callback(null, appointments[0]);
        }
    );
};

const updateAppointment = (id, appointmentData, callback) => {
    const {
        pet_id,
        service_id,
        appointment_date,
        payment_status,
    } = appointmentData;

    if (!pet_id || !service_id || !appointment_date) {
        const error = new Error(
            "Pet, serviço e data do agendamento são obrigatórios"
        );

        error.statusCode = 400;

        return callback(error);
    }

    const dateError = validateAppointmentDate(appointment_date);

    if (dateError) {
        return callback(dateError);
    }

    const validPaymentStatuses = ["pending", "paid"];

    if (!validPaymentStatuses.includes(payment_status)) {
        const statusError = new Error(
            "Status de pagamento inválido"
        );

        statusError.statusCode = 400;

        return callback(statusError);
    }

    AppointmentModel.getAppointmentById(
        id,
        (error, appointments) => {
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

            PetModel.getPetById(
                pet_id,
                (error, pets) => {
                    if (error) {
                        return callback(error);
                    }

                    if (pets.length === 0) {
                        const petError = new Error(
                            "Pet não encontrado"
                        );

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

                            const duration = services[0].duration;

                            const endTimeError = validateAppointmentEndTime(
                                appointment_date,
                                duration
                            );

                            if (endTimeError) {
                                return callback(endTimeError);
                            }

                            AppointmentModel.checkPetScheduleConflictForUpdate(
                                id,
                                pet_id,
                                appointment_date,
                                duration,
                                (error, conflicts) => {
                                    if (error) {
                                        return callback(error);
                                    }

                                    if (conflicts.length > 0) {
                                        const conflictError = new Error(
                                            "O pet já possui um agendamento neste período"
                                        );

                                        conflictError.statusCode = 409;

                                        return callback(conflictError);
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
                        }
                    );
                }
            );
        }
    );
};

const deleteAppointment = (id, callback) => {
    AppointmentModel.getAppointmentById(
        id,
        (error, appointments) => {
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

            AppointmentModel.deleteAppointment(
                id,
                callback
            );
        }
    );
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};