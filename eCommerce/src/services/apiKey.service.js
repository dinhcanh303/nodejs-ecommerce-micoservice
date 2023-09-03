"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("crypto");

const findById = async (key) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};
const createApiKey = async () => {
  const keyHash = crypto.randomBytes(64).toString("hex");
  const apiKey = await apiKeyModel.create({
    key: keyHash,
    permissions: ["0000"],
  });
  return apiKey;
};
module.exports = {
  findById,
  createApiKey,
};
