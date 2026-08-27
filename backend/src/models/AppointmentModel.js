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
    query += ` AND DATE(appointments.appointment_date) = ?`;
    values.push(filters.date);
  }

  if (filters.pet_id) {
    query += ` AND appointments.pet_id = ?`;
    values.push(filters.pet_id);
  }

  if (filters.payment_status) {
    query += ` AND appointments.payment_status = ?`;
    values.push(filters.payment_status);
  }

  query += `
    ORDER BY appointments.appointment_date ASC
    LIMIT ? OFFSET ?
`;

  values.push(filters.limit);
  values.push(filters.offset);

  connection.query(query, values, callback);
};

const createAppointment = (appointment, callback) => {
  const query = `
        INSERT INTO appointments
        (pet_id, service_id, appointment_date, payment_status)
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

  connection.query(query, [id], callback);
};

const updateAppointment = (id, appointment, callback) => {
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

  connection.query(query, [id], callback);
};

const checkPetScheduleConflict = (
  pet_id,
  appointment_date,
  duration,
  callback
) => {
  const query = `
    SELECT appointments.id
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
        SELECT appointments.id
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
        SELECT COUNT(*) AS total
        FROM appointments
        WHERE 1 = 1
    `;

    const values = [];

    if (filters.date) {
        query += ` AND DATE(appointments.appointment_date) = ?`;
        values.push(filters.date);
    }

    if (filters.pet_id) {
        query += ` AND appointments.pet_id = ?`;
        values.push(filters.pet_id);
    }

    if (filters.payment_status) {
        query += ` AND appointments.payment_status = ?`;
        values.push(filters.payment_status);
    }

    connection.query(query, values, callback);
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
        [appointment_status, id],
        callback
    );
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  checkPetScheduleConflict,
  checkPetScheduleConflictForUpdate,
  getFilteredAppointments,
  countAppointments,
  updateAppointmentStatus,
};