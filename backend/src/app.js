const express = require("express");
require("./config/database");
const routes = require("./routes/index.routes");
const app = express();

app.use(express.json());
app.use(routes);



module.exports = app;