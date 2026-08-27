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

const getAllAppointments = (filters, callback) => {
    const page = filters.page ? Number(filters.page) : 1;
    const limit = filters.limit ? Number(filters.limit) : 10;

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1
    ) {
        const error = new Error(
            "Página e limite devem ser números inteiros maiores que zero"
        );

        error.statusCode = 400;

        return callback(error);
    }

    if (limit > 100) {
        const error = new Error(
            "O limite máximo por página é 100"
        );

        error.statusCode = 400;

        return callback(error);
    }

    if (
        filters.payment_status &&
        !["pending", "paid"].includes(filters.payment_status)
    ) {
        const error = new Error(
            "Status de pagamento inválido"
        );

        error.statusCode = 400;

        return callback(error);
    }

    if (filters.pet_id) {
        const petId = Number(filters.pet_id);

        if (!Number.isInteger(petId) || petId < 1) {
            const error = new Error(
                "ID do pet inválido"
            );

            error.statusCode = 400;

            return callback(error);
        }
    }

    if (filters.date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(filters.date)) {
            const error = new Error(
                "A data deve estar no formato YYYY-MM-DD"
            );

            error.statusCode = 400;

            return callback(error);
        }

        const date = new Date(`${filters.date}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            const error = new Error(
                "Data inválida"
            );

            error.statusCode = 400;

            return callback(error);
        }
    }

    const offset = (page - 1) * limit;

    const pagination = {
        limit,
        offset,
    };

    const hasFilters =
        filters.date ||
        filters.pet_id ||
        filters.payment_status;

    const handleAppointments = (error, appointments) => {
        if (error) {
            return callback(error);
        }

        AppointmentModel.countAppointments(
            filters,
            (countError, result) => {
                if (countError) {
                    return callback(countError);
                }

                const total = result[0].total;
                const totalPages = Math.ceil(total / limit);

                callback(null, {
                    data: appointments,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages,
                    },
                });
            }
        );
    };

    if (hasFilters) {
        return AppointmentModel.getFilteredAppointments(
            {
                ...filters,
                ...pagination,
            },
            handleAppointments
        );
    }

    AppointmentModel.getAllAppointments(
        pagination,
        handleAppointments
    );
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

const updateAppointmentStatus = (
    id,
    appointment_status,
    callback
) => {
    const validStatuses = [
        "scheduled",
        "completed",
        "cancelled"
    ];

    if (!validStatuses.includes(appointment_status)) {
        const error = new Error(
            "Status do agendamento inválido"
        );

        error.statusCode = 400;

        return callback(error);
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

            const currentStatus =
                appointments[0].appointment_status;

            if (
                currentStatus === "completed" ||
                currentStatus === "cancelled"
            ) {
                const statusError = new Error(
                    "Não é possível alterar um agendamento finalizado ou cancelado"
                );

                statusError.statusCode = 409;

                return callback(statusError);
            }

            if (
                currentStatus === "scheduled" &&
                appointment_status === "scheduled"
            ) {
                const statusError = new Error(
                    "O agendamento já está com status scheduled"
                );

                statusError.statusCode = 409;

                return callback(statusError);
            }

            const appointmentDate = new Date(
                appointments[0].appointment_date
            );

            const now = new Date();

            if (
                appointment_status === "completed" &&
                appointmentDate > now
            ) {
                const dateError = new Error(
                    "Não é possível concluir um agendamento antes do horário do atendimento"
                );

                dateError.statusCode = 409;

                return callback(dateError);
            }

            AppointmentModel.updateAppointmentStatus(
                id,
                appointment_status,
                callback
            );
        }
    );
};

const updatePaymentStatus = (
    id,
    payment_status,
    callback
) => {
    const validPaymentStatuses = [
        "pending",
        "paid"
    ];

    if (!validPaymentStatuses.includes(payment_status)) {
        const error = new Error(
            "Status de pagamento inválido"
        );

        error.statusCode = 400;

        return callback(error);
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

            const currentPaymentStatus =
                appointments[0].payment_status;

            if (
                currentPaymentStatus === "paid" &&
                payment_status === "pending"
            ) {
                const paymentError = new Error(
                    "Não é possível alterar um pagamento já confirmado para pendente"
                );

                paymentError.statusCode = 409;

                return callback(paymentError);
            }

            if (
                currentPaymentStatus === payment_status
            ) {
                const paymentError = new Error(
                    `O pagamento já está com status ${payment_status}`
                );

                paymentError.statusCode = 409;

                return callback(paymentError);
            }

            AppointmentModel.updatePaymentStatus(
                id,
                payment_status,
                callback
            );
        }
    );
};

const getDailyAgenda = (date, callback) => {
    if (!date) {
        const error = new Error(
            "A data da agenda é obrigatória"
        );

        error.statusCode = 400;

        return callback(error);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
        const error = new Error(
            "A data deve estar no formato YYYY-MM-DD"
        );

        error.statusCode = 400;

        return callback(error);
    }

    AppointmentModel.getDailyAgenda(
        date,
        (error, appointments) => {
            if (error) {
                return callback(error);
            }

            const agenda = appointments.map(
                (appointment) => {
                    const appointmentDate =
                        new Date(
                            appointment.appointment_date
                        );

                    const time =
                        appointmentDate
                            .toLocaleTimeString(
                                "pt-BR",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            );

                    return {
                        id: appointment.id,
                        time,
                        pet: appointment.pet_name,
                        client: appointment.client_name,
                        service: appointment.service_name,
                        duration: appointment.duration,
                        price: appointment.price,
                        payment_status:
                            appointment.payment_status,
                        appointment_status:
                            appointment.appointment_status,
                    };
                }
            );

            callback(null, {
                date,
                total: agenda.length,
                appointments: agenda,
            });
        }
    );
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    updatePaymentStatus,
    getDailyAgenda,
};