const DashboardModel = require("../models/DashboardModel");

const getDashboardSummary = (filters, callback) => {
  const { start_date, end_date } = filters;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (start_date && !dateRegex.test(start_date)) {
    const error = new Error(
      "A data inicial deve estar no formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    return callback(error);
  }

  if (end_date && !dateRegex.test(end_date)) {
    const error = new Error(
      "A data final deve estar no formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    return callback(error);
  }

  if (start_date && end_date && start_date > end_date) {
    const error = new Error(
      "A data inicial não pode ser maior que a data final"
    );

    error.statusCode = 400;
    return callback(error);
  }

  DashboardModel.getDashboardSummary(
    {
      start_date,
      end_date,
    },
    (error, results) => {
      if (error) {
        return callback(error);
      }

      const summary = results[0];

      return callback(null, {
        period: {
          start_date: start_date || null,
          end_date: end_date || null,
        },

        appointments: {
          total: Number(summary.total_appointments) || 0,
          scheduled:
            Number(summary.scheduled_appointments) || 0,
          completed:
            Number(summary.completed_appointments) || 0,
          cancelled:
            Number(summary.cancelled_appointments) || 0,
        },

        payments: {
          pending: Number(summary.pending_payments) || 0,
          paid: Number(summary.paid_payments) || 0,
        },

        revenue: {
          total:
            Number(summary.total_revenue || 0).toFixed(2),
          received:
            Number(summary.received_revenue || 0).toFixed(2),
          pending:
            Number(summary.pending_revenue || 0).toFixed(2),
        },

        clients: {
          total: Number(summary.total_clients) || 0,
        },

        pets: {
          total: Number(summary.total_pets) || 0,
        },

        services: {
          total: Number(summary.total_services) || 0,
        },
      });
    }
  );
};

module.exports = {
  getDashboardSummary,
};