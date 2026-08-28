const connection = require("../config/database");

const getDashboardSummary = (filters, callback) => {
    const values = [];

    let appointmentDateFilter = "";

    if (filters.start_date) {
        appointmentDateFilter += `
      AND appointments.appointment_date >= ?
    `;

        values.push(`${filters.start_date} 00:00:00`);
    }

    if (filters.end_date) {
        appointmentDateFilter += `
      AND appointments.appointment_date <= ?
    `;

        values.push(`${filters.end_date} 23:59:59`);
    }

    const query = `
    SELECT
      (
        SELECT COUNT(*)
        FROM appointments
        WHERE 1 = 1
        ${appointmentDateFilter}
      ) AS total_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_status = 'scheduled'
        ${appointmentDateFilter}
      ) AS scheduled_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_status = 'completed'
        ${appointmentDateFilter}
      ) AS completed_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_status = 'cancelled'
        ${appointmentDateFilter}
      ) AS cancelled_appointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE payment_status = 'pending'
        ${appointmentDateFilter}
      ) AS pending_payments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE payment_status = 'paid'
        ${appointmentDateFilter}
      ) AS paid_payments,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON appointments.service_id = services.id
        WHERE appointments.appointment_status = 'completed'
        ${appointmentDateFilter}
      ) AS total_revenue,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON appointments.service_id = services.id
        WHERE appointments.appointment_status = 'completed'
          AND appointments.payment_status = 'paid'
        ${appointmentDateFilter}
      ) AS received_revenue,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON appointments.service_id = services.id
        WHERE appointments.appointment_status = 'completed'
          AND appointments.payment_status = 'pending'
        ${appointmentDateFilter}
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

    const queryValues = [];

    const filterOccurrences = 9;

    for (let i = 0; i < filterOccurrences; i++) {
        queryValues.push(...values);
    }

    connection.query(
        query,
        queryValues,
        callback
    );
};

const getUpcomingAppointments = (limit, callback) => {
    const query = `
    SELECT
      appointments.id,
      appointments.appointment_date,
      appointments.payment_status,
      appointments.appointment_status,

      pets.id AS pet_id,
      pets.name AS pet_name,

      clients.id AS client_id,
      clients.name AS client_name,

      services.id AS service_id,
      services.name AS service_name,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN clients
      ON pets.client_id = clients.id

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE appointments.appointment_status = 'scheduled'
      AND appointments.appointment_date >= NOW()

    ORDER BY appointments.appointment_date ASC

    LIMIT ?
  `;

    connection.query(
        query,
        [limit],
        callback
    );
};

module.exports = {
    getDashboardSummary,
    getUpcomingAppointments,
};