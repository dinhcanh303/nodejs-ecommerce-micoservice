"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
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

module.exports = {
  getInfoData,
  selectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertObjectIdMongodb,
};
