"use strict";

const { convertObjectIdMongodb } = require("../../utils");
const inventory = require("../inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inven_product_id: convertObjectIdMongodb(productId),
    inven_shop_id: shopId,
    inven_location: location,
    inven_stock: stock,
  });
};

module.exports = { insertInventory };
