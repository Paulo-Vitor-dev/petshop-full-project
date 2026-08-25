const AppointmentService = require("../services/AppointmentService");

const getAllAppointments = (req, res) => {
    const filters = {
        date: req.query.date,
        pet_id: req.query.pet_id,
        payment_status: req.query.payment_status,
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

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};