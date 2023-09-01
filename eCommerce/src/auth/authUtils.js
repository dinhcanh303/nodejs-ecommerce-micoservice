'use strict';
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { HEADER } = require('../configs/config.header');
const { AuthFailureError, NotFoundError, BadRequestError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const { request } = require('express');

const createTokenPair = async (payload,publicKey,privateKey) => {
    try {
        const accessToken = await jwt.sign(payload,publicKey,{
            expiresIn: "2 days",
        });
        const refreshToken = await jwt.sign(payload,privateKey,{
            expiresIn: "7 days",
        });
        jwt.verify(accessToken, publicKey,(err,decode) => {
            if(err){
                console.log(`error verify::`,err);
            }else{
                console.log(`decode verify::`,decode);
            }
        })
        return {accessToken,refreshToken};
    } catch (error) {
        console.log(error)
    }
}
const authentication = asyncHandler(async (req,res,next) => {
    /*
    1 - Check userId missing
    2 - get AT
    3 - verify token
    4 - check user in dbs?
    5 - check keyStore with this userId
    6 - OK all => return next
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request');
    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not Found KeyStore');
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if(refreshToken){
        verifyToken(userId,refreshToken,keyStore,(decodeUser,token) => {
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = token;
        },'refreshToken');
        return next();
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    verifyToken(userId,accessToken,keyStore,(decodeUser,token) => {
        req.keyStore = keyStore;
        req.user = decodeUser;
    });
    return next();
})
const verifyToken = (userId,token,keyStore,callback,type = 'accessToken') => {
    var key;
    switch (type) {
        case 'accessToken':
            key = keyStore.publicKey
            break;
        case 'refreshToken':
            key = keyStore.privateKey
            break;
        default:
            throw new BadRequestError(`Invalid token type : ${type}`);
    }
    if(!token) throw new AuthFailureError('Invalid Request');
    try {
        const decodeUser = jwt.verify(token, key);
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
        callback(decodeUser,token);
    } catch (error) {
        throw error;
    }
}
const authenticationV1 = asyncHandler(async (req,res,next) => {
    /*
    1 - Check userId missing
    2 - get AT
    3 - verify token
    4 - check user in dbs?
    5 - check keyStore with this userId
    6 - OK all => return next
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request');
    const keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not Found KeyStore');
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureError('Invalid Request');
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error;
    }
})
const verifyJWT = async (token,keySecret) => {
    return jwt.verify(token, keySecret);
}
module.exports = {createTokenPair, authentication , verifyJWT};