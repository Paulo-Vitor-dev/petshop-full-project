const AppointmentService = require("../services/AppointmentService");

const getAllAppointments = (req, res) => {
    AppointmentService.getAllAppointments((error, appointments) => {
        if (error) {
            return res.status(500).json({
                error: error.message,
            });
        }

        return res.status(200).json(appointments);
    });
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

module.exports = {
    getAllAppointments,
    createAppointment,
};