"use strict";
const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const countConnect = () => {
  const numConnections = numConnections();
  console.log(`Number of connections: ${numConnections}`);
};

const numConnections = () => {
  return mongoose.connections.length;
};

const checkOverLoad = () => {
  setInterval(() => {
    const numConnections = numConnections();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} mb`);
    if (numConnections > maxConnections)
      console.log(`Connections overload detected`);
  }, _SECONDS);
};
module.exports = {
  countConnect,
  checkOverLoad,
};
