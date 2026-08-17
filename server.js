const express = require("express");
const cors = require("cors");
const { Route } = require("./Routes/UserDataRoutes");
const bodyParser = require("body-parser");
require("dotenv").config();

const dbconnect = require("./Db/dBConnect");
const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(Route);

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});