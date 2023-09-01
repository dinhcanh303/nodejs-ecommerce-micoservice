"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();
//authentication
router.use(authentication);
//create product
router.post("/",asyncHandler(productController.createProduct));
router.post("/publish/:id",asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id",asyncHandler(productController.unPublishProductByShop));
//Query
router.get("/drafts/all",asyncHandler(productController.getAllDraftsForShop));
router.get("/published/all",asyncHandler(productController.getAllPublishedForShop));
module.exports = router;