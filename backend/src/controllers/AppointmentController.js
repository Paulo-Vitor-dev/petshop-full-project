const AppointmentService = require("../services/AppointmentService");

const getAllAppointments = (req, res) => {
  const filters = {
    date: req.query.date,
    pet_id: req.query.pet_id,
    payment_status: req.query.payment_status,
    appointment_status: req.query.appointment_status,
    page: req.query.page,
    limit: req.query.limit,
  };

  AppointmentService.getAllAppointments(
    filters,
    (error, appointments) => {
      if (error) {
        return res.status(error.statusCode || 500).json({
          error: error.message,
        });
      }

      return res.status(200).json(appointments);
    }
  );
};

const createAppointment = (req, res) => {
  const appointmentData = req.body;

  AppointmentService.createAppointment(
    appointmentData,
    (error, result) => {
      if (error) {
        return res.status(error.statusCode || 500).json({
          error: error.message,
        });
      }

      return res.status(201).json({
        id: result.insertId,
        ...appointmentData,
        payment_status:
          appointmentData.payment_status || "pending",
      });
    }
  );
};

const getAppointmentById = (req, res) => {
  const { id } = req.params;

  AppointmentService.getAppointmentById(
    id,
    (error, appointment) => {
      if (error) {
        return res.status(error.statusCode || 500).json({
          error: error.message,
        });
      }

      return res.status(200).json(appointment);
    }
  );
};

const updateAppointment = (req, res) => {
  const { id } = req.params;
  const appointmentData = req.body;

  AppointmentService.updateAppointment(
    id,
    appointmentData,
    (error) => {
      if (error) {
        return res.status(error.statusCode || 500).json({
          error: error.message,
        });
      }

      return res.status(200).json({
        message: "Agendamento atualizado com sucesso",
        id: Number(id),
        ...appointmentData,
      });
    }
  );
};

const deleteAppointment = (req, res) => {
  const { id } = req.params;

  AppointmentService.deleteAppointment(id, (error) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "Agendamento excluído com sucesso",
    });
  });
};

const updateAppointmentStatus = (req, res) => {
    const { id } = req.params;
    const { appointment_status } = req.body;

    AppointmentService.updateAppointmentStatus(
        id,
        appointment_status,
        (error) => {
            if (error) {
                return res.status(
                    error.statusCode || 500
                ).json({
                    error: error.message,
                });
            }

            return res.status(200).json({
                message: "Status do agendamento atualizado com sucesso",
                id: Number(id),
                appointment_status,
            });
        }
    );
};

const updatePaymentStatus = (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;

    AppointmentService.updatePaymentStatus(
        id,
        payment_status,
        (error) => {
            if (error) {
                return res.status(
                    error.statusCode || 500
                ).json({
                    error: error.message,
                });
            }

            return res.status(200).json({
                message: "Status do pagamento atualizado com sucesso",
                id: Number(id),
                payment_status,
            });
        }
    );
};

const getDailyAgenda = (req, res) => {
    const { date } = req.query;

    AppointmentService.getDailyAgenda(
        date,
        (error, agenda) => {
            if (error) {
                return res.status(
                    error.statusCode || 500
                ).json({
                    error: error.message,
                });
            }

            return res.status(200).json(agenda);
        }
    );
};

const getAppointmentsSummary = (req, res) => {
  AppointmentService.getAppointmentsSummary((error, summary) => {
    if (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }

    return res.status(200).json(summary);
  });
};

const getRevenueSummary = (req, res) => {
  const filters = {
    start_date: req.query.start_date,
    end_date: req.query.end_date,
  };

  AppointmentService.getRevenueSummary(
    filters,
    (error, summary) => {
      if (error) {
        return res
          .status(error.statusCode || 500)
          .json({
            error: error.message,
          });
      }

      return res.status(200).json(summary);
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
  getAppointmentsSummary,
  getRevenueSummary,
};