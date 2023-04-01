const utils = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const baseResponse = require("../dto/baseResponse.dto");

module.exports = (req, res, next) => {
  try {
    if (!req.url.includes("/signIn")) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = utils.helpers.verifyToken(token);
      if (decodedToken.decodedToken === null) {
        let error = new Error("Incorrect JWT Token");
        utils.helpers.logToError(error, req);
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({
            ...baseResponse,
            success: false,
            error: true,
            timestamp: Date.now(),
            message: error.message,
            code: StatusCodes.UNAUTHORIZED,
          });
        return;
      }
      req.user = decodedToken;
      next();
      return;
    }
    next();
  } catch (error) {
    utils.helpers.logToError(
      error,
      req,
      "auth middleware işleminde hata gerçekleşti"
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        ...baseResponse,
        success: false,
        error: true,
        timestamp: Date.now(),
        message: error.message,
        code: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    return;
  }
};
