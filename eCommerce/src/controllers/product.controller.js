"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new Created({
      message: "Create new Product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  //POST

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product Shop successfully",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product Shop successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  /**
   *
   * @param {String} keySearch
   * @return { JSON }
   */
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search Product Shop successfully",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };
  //Query
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return { JSON }
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all draft products",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return { JSON }
   */
  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all published products",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {String} sort
   * @param {Number} page
   * @param {Array} select
   * @return { JSON }
   */
  findAllProducts = async (req, res, next) => {
    console.log(123);
    new SuccessResponse({
      message: "Get all products",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };
  /**
   * @desc Get all Drafts for shop
   * @param {Number} product_id
   * @return { JSON }
   */
  findProduct = async (req, res, next) => {
    console.log(123);
    new SuccessResponse({
      message: "Get detail products",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
