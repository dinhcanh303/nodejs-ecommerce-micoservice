"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const  crypto = require("crypto");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const selectData = (select = [], unSelect = false) => {
  const optionSelect = unSelect ? 0 : 1;
  return Object.fromEntries(select.map((e) => [e, optionSelect]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};

//check null
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((i) => {
    if (typeof obj[i] === "object" && !Array.isArray(obj[i])) {
      console.log(typeof obj[i]);
      const res = updateNestedObjectParser(obj[i]);
      Object.keys(res).forEach((j) => {
        final[`${i}.${j}`] = res[j];
      });
    } else {
      final[i] = obj[i];
    }
  });
  return final;
};
const convertObjectIdMongodb = (id) => new Types.ObjectId(id);

const randomUserName = (length = 6) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let username = '';
  for(let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * characters.length);
    username += characters[idx];
  }
  return username;
}
const randomPassword = (length = 6) => {
  const numbers = '0123456789'
  let password = '';
  for(let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * numbers.length);
    password += numbers[idx];
  }
  return password;

}
const generateUniqueUserNames = (count) => {
  const usernames = new Set();
  while(usernames.size < count){
    let username = randomUserName();
    usernames.add(username);
  }
  return Array.from(usernames);
}
const generateUniquePasswords = (count) => {
  const passwords = new Set();
  while(passwords.size < count){
    let password = randomPassword();
    passwords.add(crypto.createHash("sha256").update(password).digest('hex').toString());
  }
  return Array.from(passwords);
}

module.exports = {
  getInfoData,
  selectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertObjectIdMongodb,
  generateUniqueUserNames,
  generateUniquePasswords,
};
