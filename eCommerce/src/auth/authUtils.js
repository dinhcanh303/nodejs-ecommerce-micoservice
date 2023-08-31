'use strict';
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { HEADER } = require('../configs/config.header');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

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