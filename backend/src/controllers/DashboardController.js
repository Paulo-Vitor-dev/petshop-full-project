const DashboardService = require(
  "../services/DashboardService"
);

const getDashboardSummary = (req, res) => {
  DashboardService.getDashboardSummary(
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