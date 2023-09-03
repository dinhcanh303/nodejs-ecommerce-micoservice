"use strict";
const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();
//sign up
router.post("/signup", asyncHandler(AccessController.signUp));
router.post("/login", asyncHandler(AccessController.login));

router.post("/createApiKey", asyncHandler(AccessController.createApiKey));
//authentication
router.use(authentication);
//handle refresh token
router.post(
  "/handleRefreshToken",
  asyncHandler(AccessController.handleRefreshToken)
);
//logout
router.post("/logout", asyncHandler(AccessController.logout));
module.exports = router;
