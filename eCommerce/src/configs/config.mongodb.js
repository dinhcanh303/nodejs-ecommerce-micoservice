"use strict";
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3055,
  },
  db: {
    host: process.env.DEV_DB_HOST || "127.0.0.1",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "eCommerceDEV",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3055,
  },
  db: {
    host: process.env.PRO_DB_HOST || "127.0.0.1",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "eCommercePRO",
  },
};
const test = {
  app: {
    port: process.env.TEST_APP_PORT || 3055,
  },
  db: {
    host: process.env.TEST_DB_HOST || "127.0.0.1",
    port: process.env.TEST_DB_PORT || 27017,
    name: process.env.TEST_DB_NAME || "eCommerceTEST",
  },
};
const config = { dev, pro, test };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
