"use strict";
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const app = express();
//
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db
require("./databases/init.mongodb");
//init routes
app.use("/", require("./routes/index"));

module.exports = app;
