const connection = require("../config/database");

const getAllAppointments = (pagination, callback) => {
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
      services.price,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN clients
      ON pets.client_id = clients.id

    INNER JOIN services
      ON appointments.service_id = services.id

    ORDER BY appointments.appointment_date ASC

    LIMIT ? OFFSET ?
  `;

  connection.query(
    query,
    [
      pagination.limit,
      pagination.offset,
    ],
    callback
  );
};

const getFilteredAppointments = (filters, callback) => {
  let query = `
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
      services.price,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN clients
      ON pets.client_id = clients.id

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE 1 = 1
  `;

  const values = [];

  if (filters.date) {
    query += `
      AND DATE(appointments.appointment_date) = ?
    `;

    values.push(filters.date);
  }

  if (filters.pet_id) {
    query += `
      AND appointments.pet_id = ?
    `;

    values.push(filters.pet_id);
  }

  if (filters.payment_status) {
    query += `
      AND appointments.payment_status = ?
    `;

    values.push(filters.payment_status);
  }

  if (filters.appointment_status) {
    query += `
      AND appointments.appointment_status = ?
    `;

    values.push(filters.appointment_status);
  }

  query += `
    ORDER BY appointments.appointment_date ASC
    LIMIT ? OFFSET ?
  `;

  values.push(filters.limit);
  values.push(filters.offset);

  connection.query(
    query,
    values,
    callback
  );
};

const createAppointment = (appointment, callback) => {
  const query = `
    INSERT INTO appointments
      (
        pet_id,
        service_id,
        appointment_date,
        payment_status
      )
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      appointment.pet_id,
      appointment.service_id,
      appointment.appointment_date,
      appointment.payment_status || "pending",
    ],
    callback
  );
};

const getAppointmentById = (id, callback) => {
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
      services.price,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN clients
      ON pets.client_id = clients.id

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE appointments.id = ?
  `;

  connection.query(
    query,
    [id],
    callback
  );
};

const updateAppointment = (
  id,
  appointment,
  callback
) => {
  const query = `
    UPDATE appointments
    SET
      pet_id = ?,
      service_id = ?,
      appointment_date = ?,
      payment_status = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      appointment.pet_id,
      appointment.service_id,
      appointment.appointment_date,
      appointment.payment_status,
      id,
    ],
    callback
  );
};

const deleteAppointment = (id, callback) => {
  const query = `
    DELETE FROM appointments
    WHERE id = ?
  `;

  connection.query(
    query,
    [id],
    callback
  );
};

const checkPetScheduleConflict = (
  pet_id,
  appointment_date,
  duration,
  callback
) => {
  const query = `
    SELECT
      appointments.id

    FROM appointments

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE appointments.pet_id = ?
      AND appointments.appointment_status = 'scheduled'

      AND ? < DATE_ADD(
        appointments.appointment_date,
        INTERVAL services.duration MINUTE
      )

      AND DATE_ADD(
        ?,
        INTERVAL ? MINUTE
      ) > appointments.appointment_date
  `;

  connection.query(
    query,
    [
      pet_id,
      appointment_date,
      appointment_date,
      duration,
    ],
    callback
  );
};

const checkPetScheduleConflictForUpdate = (
  id,
  pet_id,
  appointment_date,
  duration,
  callback
) => {
  const query = `
    SELECT
      appointments.id

    FROM appointments

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE appointments.pet_id = ?
      AND appointments.id != ?
      AND appointments.appointment_status = 'scheduled'

      AND ? < DATE_ADD(
        appointments.appointment_date,
        INTERVAL services.duration MINUTE
      )

      AND DATE_ADD(
        ?,
        INTERVAL ? MINUTE
      ) > appointments.appointment_date
  `;

  connection.query(
    query,
    [
      pet_id,
      id,
      appointment_date,
      appointment_date,
      duration,
    ],
    callback
  );
};

const countAppointments = (filters, callback) => {
  let query = `
    SELECT
      COUNT(*) AS total

    FROM appointments

    WHERE 1 = 1
  `;

  const values = [];

  if (filters.date) {
    query += `
      AND DATE(appointments.appointment_date) = ?
    `;

    values.push(filters.date);
  }

  if (filters.pet_id) {
    query += `
      AND appointments.pet_id = ?
    `;

    values.push(filters.pet_id);
  }

  if (filters.payment_status) {
    query += `
      AND appointments.payment_status = ?
    `;

    values.push(filters.payment_status);
  }

  if (filters.appointment_status) {
    query += `
      AND appointments.appointment_status = ?
    `;

    values.push(filters.appointment_status);
  }

  connection.query(
    query,
    values,
    callback
  );
};

const updateAppointmentStatus = (
  id,
  appointment_status,
  callback
) => {
  const query = `
    UPDATE appointments
    SET appointment_status = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      appointment_status,
      id,
    ],
    callback
  );
};

const updatePaymentStatus = (
  id,
  payment_status,
  callback
) => {
  const query = `
    UPDATE appointments
    SET payment_status = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      payment_status,
      id,
    ],
    callback
  );
};

const getDailyAgenda = (date, callback) => {
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
      services.price,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN clients
      ON pets.client_id = clients.id

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE DATE(appointments.appointment_date) = ?

    ORDER BY appointments.appointment_date ASC
  `;

  connection.query(
    query,
    [date],
    callback
  );
};

const getAppointmentsSummary = (callback) => {
  const query = `
    SELECT
      COUNT(*) AS total,

      SUM(
        CASE
          WHEN appointment_status = 'scheduled'
          THEN 1
          ELSE 0
        END
      ) AS scheduled,

      SUM(
        CASE
          WHEN appointment_status = 'completed'
          THEN 1
          ELSE 0
        END
      ) AS completed,

      SUM(
        CASE
          WHEN appointment_status = 'cancelled'
          THEN 1
          ELSE 0
        END
      ) AS cancelled,

      SUM(
        CASE
          WHEN payment_status = 'pending'
          THEN 1
          ELSE 0
        END
      ) AS payment_pending,

      SUM(
        CASE
          WHEN payment_status = 'paid'
          THEN 1
          ELSE 0
        END
      ) AS payment_paid

    FROM appointments
  `;

  connection.query(
    query,
    callback
  );
};

const getRevenueSummary = (filters, callback) => {
  let query = `
    SELECT
      COUNT(*) AS completed_appointments,

      SUM(
        CASE
          WHEN payment_status = 'paid' THEN 1
          ELSE 0
        END
      ) AS paid_appointments,

      SUM(
        CASE
          WHEN payment_status = 'pending' THEN 1
          ELSE 0
        END
      ) AS pending_appointments,

      COALESCE(SUM(services.price), 0) AS total_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN appointments.payment_status = 'paid'
            THEN services.price
            ELSE 0
          END
        ),
        0
      ) AS received_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN appointments.payment_status = 'pending'
            THEN services.price
            ELSE 0
          END
        ),
        0
      ) AS pending_revenue

    FROM appointments

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE appointments.appointment_status = 'completed'
  `;

  const values = [];

  if (filters.start_date) {
    query += `
      AND appointments.appointment_date >= ?
    `;

    values.push(`${filters.start_date} 00:00:00`);
  }

  if (filters.end_date) {
    query += `
      AND appointments.appointment_date <= ?
    `;

    values.push(`${filters.end_date} 23:59:59`);
  }

  connection.query(query, values, callback);
};

const getServiceStats = (callback) => {
  const query = `
    SELECT
      services.id AS service_id,
      services.name AS service_name,

      COUNT(appointments.id) AS appointments,

      COALESCE(
        SUM(services.price),
        0
      ) AS revenue

    FROM appointments

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE appointments.appointment_status = 'completed'

    GROUP BY
      services.id,
      services.name

    ORDER BY appointments DESC, service_name ASC
  `;

  connection.query(query, callback);
};

module.exports = {
  getAllAppointments,
  getFilteredAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  checkPetScheduleConflict,
  checkPetScheduleConflictForUpdate,
  countAppointments,
  updateAppointmentStatus,
  updatePaymentStatus,
  getDailyAgenda,
  getAppointmentsSummary,
  getRevenueSummary,
  getServiceStats,
};