"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unknown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    /*
      card_id:
      stock:1,
      created_at:
    */
    inven_reservation: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
