const connection = require("../config/database");

const getAllAppointments = (callback) => {
    const query = `
        SELECT
            appointments.id,
            appointments.appointment_date,
            appointments.payment_status,

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
    `;

    connection.query(query, callback);
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

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};