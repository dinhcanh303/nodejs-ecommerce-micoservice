"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const { createApiKey } = require("../services/apiKey.service");

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new Created({
      message: "Registered Ok!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Refresh token successfully",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  createApiKey = async (req, res, next) => {
    console.log(123);
    new Created({
      message: "Created api key successfully",
      metadata: await createApiKey(),
    }).send(res);
  };
}

module.exports = new AccessController();
