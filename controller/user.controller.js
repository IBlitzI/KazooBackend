const User = require("../models/user.model");
require("dotenv").config();
const RefreshToken = require("../models/token.model");
const bcrypt = require("bcrypt");
const utils = require("../utils/index");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes')
const baseResponse = require('../dto/baseResponse.dto')


exports.create = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req)
    if (isInvalid) {
      res.status(StatusCodes.BAD_REQUEST).json({...baseResponse,
        ...isInvalid
    })
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
    });
    const newUser = await user.save();
    res.status(StatusCodes.OK).json({...baseResponse, data: newUser, success: true, timestamp: Date.now(), code: StatusCodes.OK })
  } catch (error) {
    utils.helpers.logToError(error, req,"register işleminde hata oluştu")
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({...baseResponse,
      success: false,
      error: true,
      timestamp: Date.now(),
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
  })
  }
};

exports.login = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req)
        if (isInvalid) {
            res.status(StatusCodes.BAD_REQUEST).json({...baseResponse,
                ...isInvalid
            })
            return
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      let error = new Error("Incorrect Username");
      utils.helpers.logToError(error, req);
      res.status(StatusCodes.UNAUTHORIZED).json({...baseResponse,
        success: false,
        error: true,
        timestamp: Date.now(),
        message: new Error().message = "Kullanıcı Bulunamadı",
        code: StatusCodes.UNAUTHORIZED,
    })
    return
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      let error = new Error("Incorrect Password");
      utils.helpers.logToError(error, req);
      res.status(StatusCodes.UNAUTHORIZED).json({...baseResponse,
        success: false,
        error: true,
        timestamp: Date.now(),
        message: error.message,
        code: StatusCodes.UNAUTHORIZED,
    })
    return
    }
    const tokenUser = { username: req.body.username };
    const accessToken = utils.helpers.createToken(tokenUser)
    const refreshToken = jwt.sign(tokenUser, process.env.REFRESH_SECRET_KEY);
    const refreshTokenDB = new RefreshToken({ token: refreshToken });
    await refreshTokenDB.save();
    res.status(StatusCodes.OK).json({...baseResponse, data: {refreshToken,accessToken}, success: true, timestamp: Date.now(), code: StatusCodes.OK }) 
   } 
   catch (error) {
    utils.helpers.logToError(error, req,"login işleminde hata gerçekleşti")
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({...baseResponse,
      success: false,
      error: true,
      timestamp: Date.now(),
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
  })
  }
};

exports.logout = async (req, res) => {
  await RefreshToken.findOne({ token: req.body.token }).deleteOne();
  res.sendStatus(204);
}
