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
//handle error
app.use((req,res,next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})
app.use((err,req,res,next) => {
    console.log(err)
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || 'Internal Server Error'
    })
})
module.exports = app;
