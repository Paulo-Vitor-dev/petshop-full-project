const connection = require("../config/database");

const getDashboardSummary = (callback) => {
  const query = `
    SELECT
      (
        SELECT COUNT(*)
        FROM appointments
      ) AS total_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_status = 'scheduled'
      ) AS scheduled_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_status = 'completed'
      ) AS completed_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_status = 'cancelled'
      ) AS cancelled_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE payment_status = 'pending'
      ) AS pending_payments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE payment_status = 'paid'
      ) AS paid_payments,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON appointments.service_id = services.id
        WHERE appointments.appointment_status = 'completed'
      ) AS total_revenue,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON appointments.service_id = services.id
        WHERE appointments.appointment_status = 'completed'
          AND appointments.payment_status = 'paid'
      ) AS received_revenue,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON appointments.service_id = services.id
        WHERE appointments.appointment_status = 'completed'
          AND appointments.payment_status = 'pending'
      ) AS pending_revenue,

      (
        SELECT COUNT(*)
        FROM clients
      ) AS total_clients,

      (
        SELECT COUNT(*)
        FROM pets
      ) AS total_pets,

      (
        SELECT COUNT(*)
        FROM services
      ) AS total_services
  `;

  connection.query(query, callback);
};

module.exports = {
  getDashboardSummary,
};