const User = require("../models/user.model");
require("dotenv").config();
const RefreshToken = require("../models/token.model");
const bcrypt = require("bcrypt");
const utils = require("../utils/index");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const BaseResponse = require("../dto/baseResponse.dto");

exports.localCreate = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Validation error', isInvalid));
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      authProvider:"local"
    });
    const newUser = await user.save();
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, newUser));
  } catch (error) {
    utils.helpers.logToError(error, req, "register işleminde hata oluştu");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Kullanıcı eklenemedi', error.message));
  }
};

// exports.addCemil = async (req, res) => {
//   try {
//     const user = await User.findById(req.body.userId);
//     const cemil = req.body.cemil
    
//     user.cemil = cemil
//     res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, newUser));
//   } catch (error) {
//     utils.helpers.logToError(error, req, "register işleminde hata oluştu");
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Kullanıcı eklenemedi', error.message));
//   }
// };


exports.login = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Validation error', isInvalid));
      return;
    }

    const user = await User.findOne({ username: req.body.username, authProvider:"local" });
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!user && !passwordMatch) {
      let error = new Error("Incorrect Username or Password");
      utils.helpers.logToError(error, req);
      res.status(StatusCodes.UNAUTHORIZED).send(BaseResponse.error(res.statusCode, 'Giriş Yapılamadı', error.message));
      return;
    }

    const tokenUser = { username: req.body.username };
    const accessToken = utils.helpers.createToken(tokenUser);
    const refreshToken = jwt.sign(tokenUser, process.env.REFRESH_SECRET_KEY);
    const refreshTokenDB = new RefreshToken({ token: refreshToken });
    await refreshTokenDB.save();
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode,{refreshToken,accessToken}));
  } catch (error) {
    utils.helpers.logToError(error, req, "login işleminde hata gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Giriş Yaparken Hata Oluştu', error.message));
  }
};
exports.googleLogin = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Validation error', isInvalid));
      return;
    }

    const { googleId, email, firstName, lastName } = req.body;

    let user = await User.findOne({ email, authProvider: 'google' });

    if (!user) {
      user = new User({
        username: googleId,
        firstName,
        lastName,
        email,
        authProvider: 'google'
      });

      await user.save();
    }

    const tokenUser = { username: user.username };
    const accessToken = utils.helpers.createToken(tokenUser);
    const refreshToken = jwt.sign(tokenUser, process.env.REFRESH_SECRET_KEY);
    const refreshTokenDB = new RefreshToken({ token: refreshToken });
    await refreshTokenDB.save();

    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, { refreshToken, accessToken }));
  } catch (error) {
    utils.helpers.logToError(error, req, "Google login işleminde hata gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Google ile giriş yaparken hata oluştu', error.message));
  }
};

exports.logout = async (req, res) => {
  await RefreshToken.findOne({ token: req.body.token }).deleteOne();
  res.sendStatus(204);
};





