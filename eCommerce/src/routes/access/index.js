"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();
//sign up
router.post("/signup",asyncHandler(accessController.signUp));
router.post("/login",asyncHandler(accessController.login));
//authentication
router.use(authentication)
//handle refresh token
router.post('/handleRefreshToken',asyncHandler(accessController.handleRefreshToken));
//logout
router.post('/logout',asyncHandler(accessController.logout));
module.exports = router;
