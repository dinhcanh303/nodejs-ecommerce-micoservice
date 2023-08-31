'use strict';

const keyTokenModel = require("../models/keyToken.model.advance");

class KeyTokenServiceAdvance {
    static createKeyToken = async ({userId,publicKey }) => {
        try {
            console.log(`publicKey::`,publicKey);
            const publicKeyString = publicKey.toString();
            console.log(`publicKeyString::`,publicKeyString);
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKey,
            });
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}
module.exports = KeyTokenServiceAdvance;