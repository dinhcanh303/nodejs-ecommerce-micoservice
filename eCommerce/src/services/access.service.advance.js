"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service.advance");
const createTokenPair = require("../auth/authUtils.advance");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "00000",
  WRITER: "00001",
  EDITOR: "00002",
  ADMIN: "00003",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1 : check email exists?
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already exists",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        //created privateKey,publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", //Public key CryptoGraphy Standards!
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1", //Public key CryptoGraphy Standards!
            format: "pem",
          },
        });
        console.log({ privateKey, publicKey });
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }
        console.log(`publicKeyString::`, publicKeyString);
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(`publicKeyObject::`, publicKeyObject);
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );
        console.log(`Created Token Success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 201,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
