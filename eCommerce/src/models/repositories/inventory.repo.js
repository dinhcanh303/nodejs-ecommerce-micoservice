"use strict";

const inventory = require("../inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inven_product_id: new Types.ObjectId(productId),
    inven_shop_id: shopId,
    inven_location: location,
    inven_stock: stock,
  });
};

module.exports = { insertInventory };
