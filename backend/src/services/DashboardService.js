const DashboardModel = require("../models/DashboardModel");

const getDashboardSummary = (callback) => {
  DashboardModel.getDashboardSummary((error, results) => {
    if (error) {
      return callback(error);
    }

    const summary = results[0];

    return callback(null, {
      appointments: {
        total: Number(summary.total_appointments) || 0,
        scheduled: Number(summary.scheduled_appointments) || 0,
        completed: Number(summary.completed_appointments) || 0,
        cancelled: Number(summary.cancelled_appointments) || 0,
      },

      payments: {
        pending: Number(summary.pending_payments) || 0,
        paid: Number(summary.paid_payments) || 0,
      },

      revenue: {
        total: Number(summary.total_revenue || 0).toFixed(2),
        received: Number(summary.received_revenue || 0).toFixed(2),
        pending: Number(summary.pending_revenue || 0).toFixed(2),
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
  });
};

module.exports = {
  getDashboardSummary,
};