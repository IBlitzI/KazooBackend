require("dotenv").config();
const baseResponse = require("../dto/baseResponse.dto");
const Song = require("../models/song.model");
const { StatusCodes } = require('http-status-codes');
const utils = require("../utils/index");


exports.create = async (req, res) => {
  try {
    const newSong = new Song({
      name: req.body.name,
      artist: req.body.artist,
      url: req.body.url,
    });

    await newSong.save();
    res
      .status(StatusCodes.OK)
      .json({
        ...baseResponse,
        data: newSong,
        success: true,
        timestamp: Date.now(),
        code: StatusCodes.OK,
      });
  } catch (error) {
    utils.helpers.logToError(
      error,
      req,
      "Şarkı Ekleme İşleminde Hata Gerçekleşti"
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
  }
};
