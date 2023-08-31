"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const {createTokenPair, verifyJWT} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "00000",
  WRITER: "00001",
  EDITOR: "00002",
  ADMIN: "00003",
};

class AccessService {
  /*
    check this token user
   */
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken){
      const {userId,email}= await verifyJWT(refreshToken,foundToken.privateKey);
      console.log({userId,email})
      //delete all token in keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong happen !! Please login again');
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if(!holderToken) throw new AuthFailureError('Shop not registered');
    const {userId,email}= await verifyJWT(refreshToken,holderToken.privateKey);
    //check User Id 
    console.log('[2]--->',{userId,email})
    const foundShop = await findByEmail({email});
    if(!foundShop) throw new AuthFailureError('Shop not registered');
    //create 1 token pair
    const tokens = await createTokenPair({userId,email},holderToken.publicKey,holderToken.privateKey);
    //update tokens
    await holderToken.updateOne({
      $set: {
        refreshToken:tokens.refreshToken,
      },
      $addToSet:{
        refreshTokensUsed : refreshToken,
      }
    })
    return {
      user: {userId,email},
      tokens
    }
    
  }
  static logout = async (keyStore) => {
     const delKey = await KeyTokenService.removeKeyById(keyStore._id)
     console.log({delKey})
     return delKey;
  }
  /*
  1 - Check email in dbs
  2 - match password
  3 - create AT and RT
  4 - generate tokens
  5 - get data return login
  */
  static login = async ({email, password, refreshToken = null}) => {
    const foundShop = await findByEmail({email});
    if(!foundShop) throw new BadRequestError('Shop not registered');
    const match = bcrypt.compare(password,foundShop.password);
    if(!match) throw new AuthFailureError('Authentication error');
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair({userId: foundShop._id,email},publicKey,privateKey);
    await KeyTokenService.createKeyToken({ 
      refreshToken : tokens.refreshToken,
      publicKey,
      privateKey,
      userId: foundShop._id
    })
    return {
      shop : getInfoData({fields: ['_id','name','email'],object: foundShop}),
      tokens
    }
  }
  static signUp = async ({ name, email, password }) => {
      //step 1 : check email exists?
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError('Error: Shop already exists');
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
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");
        console.log({publicKey, privateKey});
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })
        if(!keyStore){
          throw new BadRequestError('Public Key error');
        }
        const tokens = await createTokenPair({userId: newShop._id,email},publicKey,privateKey);
        console.log(`Created Token Success::`,tokens);
        return {
          shop: getInfoData({fields: ['_id','name','email'],object: newShop}),
          tokens
        }
      }
      return null;
  };
}

module.exports = AccessService;
