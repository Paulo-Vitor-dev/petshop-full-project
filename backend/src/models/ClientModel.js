const connection = require("../config/database");
const getAllClients = (callback) => {
    const query = "SELECT * FROM clients";

    connection.query(query, callback);
};

const createClient = (client, callback) => {

    const query = `
        INSERT INTO clients
        (name, cpf, phone, email, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        query,
        [
            client.name,
            client.cpf,
            client.phone,
            client.email,
            client.address
        ],
        callback
    );

};

const getClientById = (id, callback) => {
  const query = "SELECT * FROM clients WHERE id = ?";

  connection.query(query, [id], callback);
};

const updateClient = (id, client, callback) => {
  const query = `
    UPDATE clients
    SET name = ?, cpf = ?, phone = ?, email = ?, address = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [
      client.name,
      client.cpf,
      client.phone,
      client.email,
      client.address,
      id
    ],
    callback
  );
};

const deleteClient = (id, callback) => {

    const query = `
        DELETE FROM clients
        WHERE id = ?
    `;

    connection.query(
        query,
        [id],
        callback
    );

};

const getClientServiceHistory = (client_id, callback) => {
  const query = `
    SELECT
      appointments.id AS appointment_id,
      appointments.appointment_date,
      appointments.payment_status,
      appointments.appointment_status,

      pets.id AS pet_id,
      pets.name AS pet_name,

      services.id AS service_id,
      services.name AS service_name,
      services.price,
      services.duration

    FROM appointments

    INNER JOIN pets
      ON appointments.pet_id = pets.id

    INNER JOIN services
      ON appointments.service_id = services.id

    WHERE pets.client_id = ?
      AND appointments.appointment_status = 'completed'

    ORDER BY appointments.appointment_date DESC
  `;

  connection.query(
    query,
    [client_id],
    callback
  );
};

const getClientsRanking = (filters, callback) => {
  const values = [];

  let appointmentsJoin = `
    LEFT JOIN appointments
      ON appointments.pet_id = pets.id
  `;

  if (filters.start_date) {
    appointmentsJoin += `
      AND appointments.appointment_date >= ?
    `;

    values.push(`${filters.start_date} 00:00:00`);
  }

  if (filters.end_date) {
    appointmentsJoin += `
      AND appointments.appointment_date <= ?
    `;

    values.push(`${filters.end_date} 23:59:59`);
  }

  const query = `
    SELECT
      clients.id AS client_id,
      clients.name AS client_name,

      COUNT(appointments.id) AS appointments,

      SUM(
        CASE
          WHEN appointments.appointment_status = 'completed'
          THEN 1
          ELSE 0
        END
      ) AS completed_appointments,

      COALESCE(
        SUM(
          CASE
            WHEN appointments.appointment_status = 'completed'
              AND appointments.payment_status = 'paid'
            THEN services.price
            ELSE 0
          END
        ),
        0
      ) AS total_spent

    FROM clients

    LEFT JOIN pets
      ON pets.client_id = clients.id

    ${appointmentsJoin}

    LEFT JOIN services
      ON appointments.service_id = services.id

    GROUP BY
      clients.id,
      clients.name

    ORDER BY
      completed_appointments DESC,
      total_spent DESC,
      client_name ASC
  `;

  connection.query(
    query,
    values,
    callback
  );
};

module.exports ={
    getAllClients,    
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    getClientServiceHistory,
    getClientsRanking
};

