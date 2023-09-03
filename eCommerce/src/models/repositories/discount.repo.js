"use strict";

const { selectData } = require("../../utils");
const discount = require("../discount.model");

const findDiscountCode = async ({ code, shopId }) => {
  return await discount
    .findOne({
      discount_code: code,
      discount_shop_id: convertObjectIdMongodb(shopId),
    })
    .lean();
};
const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectData(unSelect, true))
    .lean();
};
const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectData(select))
    .lean();
};

module.exports = {
  findDiscountCode,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
};
