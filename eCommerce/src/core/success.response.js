"use strict";

const { StatusCodes, ReasonPhrases } = require("./httpStatusCode/index");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message ? message : reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}
class Ok extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class Created extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
module.exports = {
  Ok,
  Created,
  SuccessResponse,
};
