const utils = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const BaseResponse = require("../dto/baseResponse.dto");

module.exports = (req, res, next) => {
  try {
    if (!req.url.includes("/signIn")) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = utils.helpers.verifyToken(token);
      if (decodedToken.decodedToken === null) {
        let error = new Error("Incorrect JWT Token");
        utils.helpers.logToError(error, req);
        res.status(StatusCodes.UNAUTHORIZED).send(BaseResponse.error(res.statusCode, 'UNAUTHORIZED', error.message));
        return;
      }
      req.user = decodedToken;
      next();
      return;
    }
    next();
  } catch (error) {
    utils.helpers.logToError(error, req, "auth middleware işleminde hata gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'AUTH MIDDLEWARE', error.message));
    return;
  }
};
