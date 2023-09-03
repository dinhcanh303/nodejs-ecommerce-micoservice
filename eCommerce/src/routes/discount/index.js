"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");
const router = express.Router();
router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
);

//authentication
router.use(authentication);
router.post("/", asyncHandler(DiscountController.createDiscountCode));
router.get("/", asyncHandler(DiscountController.getAllDiscountCodes));

module.exports = router;
