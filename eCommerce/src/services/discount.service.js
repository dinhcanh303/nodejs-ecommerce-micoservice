"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  findDiscountCode,
  findAllDiscountCodesUnSelect,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertObjectIdMongodb } = require("../utils");

/*
    Discount Services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User|Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;
    //check
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
      throw new BadRequestError("Discount code has expired");
    if (new Date(start_date) >= new Date(end_date))
      throw new BadRequestError("Start date must be before end date");
    // create index for discount code
    const foundDiscount = await findDiscountCode({ shopId, code });
    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount exists!");
    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    if (!newDiscount) throw new BadRequestError("Create new discount failed");
    return newDiscount;
  }
  static async updateDiscount() {}

  /**
   * Get all discount codes available  with products
   * @param {String} code
   * @param {String} shopId
   * @param {Number} limit
   * @param {Number} page
   * @returns {JSON}
   */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    //create index for discount_code
    const foundDisCount = await findDiscountCode({ shopId, code });
    if (!foundDisCount || !foundDisCount.discount_is_active)
      throw new NotFoundError("Discount not exist");
    const { discount_applies_to, discount_product_ids } = foundDisCount;
    let products;
    switch (discount_applies_to) {
      case "all":
        products = await findAllProducts({
          limit: +limit,
          page: +page,
          sort: "ctime",
          select: ["product_name"],
          filter: {
            product_shop: convertObjectIdMongodb(shopId),
            isPublished: true,
          },
        });
        break;
      case "specific":
        products = await findAllProducts({
          limit: +limit,
          page: +page,
          sort: "ctime",
          select: ["product_name"],
          filter: {
            _id: { $in: discount_product_ids },
            isPublished: true,
          },
        });
        break;
      default:
        throw new BadRequestError(
          `Discount applies to ${discount_applies_to} invalid`
        );
    }
    return products;
  }
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v"],
    });
    return discounts;
  }
}
