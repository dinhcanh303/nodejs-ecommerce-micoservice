"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new Created({
      message: "Create new Product successfully",
      metadata: await ProductService.createProduct(req.body.product_type,{
        ...req.body,
        product_shop: req.user.userId,
      })
    }).send(res);
  };
  //POST

  publishProductByShop = async(req, res, next) => {
    new SuccessResponse({
      message: "Publish Product Shop successfully",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      })
    }).send(res);
    
  }
  unPublishProductByShop = async(req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product Shop successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      })
    }).send(res);
    
  }
  //Query

  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @return { JSON }
   */
  getAllDraftsForShop = async(req, res, next) => {
    new SuccessResponse({
      message: "Get all draft products",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res);
  }

  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @return { JSON }
   */
  getAllPublishedForShop = async(req, res, next) => {
    new SuccessResponse({
      message: "Get all published products",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId
      })
    }).send(res);
  }
}

module.exports = new ProductController();
