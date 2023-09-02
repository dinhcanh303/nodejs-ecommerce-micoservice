"use strict";

const _ = require("lodash");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const selectData = (select = [], unSelect = false) => {
  const optionSelect = unSelect ? 0 : 1;
  return Object.fromEntries(select.map((e) => [e, optionSelect]));
};
module.exports = {
  getInfoData,
  selectData,
};
