"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get("/", asyncHandler(productController.findAllProducts));
router.get("/:productId", asyncHandler(productController.findProduct));
router.post(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
//authentication
router.use(authentication);
//create product
router.post("/", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);
//Query
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);
module.exports = router;
