"use strict";
const mongoose = require("mongoose");

const {
  db: { host, name, port },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
// Singleton Pattern
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongoose") {
    if (process.env.APP_ENV == "dev") {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => console.log(`Connected Mongodb Success`))
      .catch((err) => console.log(`Error Connect ${err}`));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceDatabase = Database.getInstance();
module.exports = instanceDatabase;
