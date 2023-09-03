"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();

router.get("/", asyncHandler(ProductController.findAllProducts));
router.get("/:productId", asyncHandler(ProductController.findProduct));
router.post(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProduct)
);
//authentication
router.use(authentication);
//create product
router.post("/", asyncHandler(ProductController.createProduct));
router.patch("/:productId", asyncHandler(ProductController.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);
//Query
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishedForShop)
);
module.exports = router;
