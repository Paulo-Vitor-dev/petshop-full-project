const DashboardService = require(
  "../services/DashboardService"
);

const getDashboardSummary = (req, res) => {
  const filters = {
    start_date: req.query.start_date,
    end_date: req.query.end_date,
  };

  DashboardService.getDashboardSummary(
    filters,
    (error, result) => {
      if (error) {
        return res
          .status(error.statusCode || 500)
          .json({
            error: error.message,
          });
      }

      return res.status(200).json(result);
    }
  );
};

module.exports = {
  getDashboardSummary,
};