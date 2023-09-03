"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");
const { convertObjectIdMongodb } = require("../utils");

class KeyTokenServiceAdvance {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //lv0
      // const tokens = await keyTokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey
      // });
      // return tokens ? tokens.publicKey : null;
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({
      user: convertObjectIdMongodb(userId),
    });
  };
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: convertObjectIdMongodb(userId),
    });
  };
}
module.exports = KeyTokenServiceAdvance;
