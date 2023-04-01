require("dotenv").config();
const Cafe = require("../models/cafe.model");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const baseResponse = require("../dto/baseResponse.dto");

exports.create = async (req, res) => {
  try {
    const newCafe = new Cafe({
      name: req.body.name,
      location: req.body.location,
      playlist: req.body.playlist,
    });

    await newCafe.save();

    res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: newCafe,
      success: true,
      timestamp: Date.now(),
      code: StatusCodes.OK,
    });
  } catch (error) {
    utils.helpers.logToError(
      error,
      req,
      "Cafe Ekleme İşleminde Hata Gerçekleşti"
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ...baseResponse,
      success: false,
      error: true,
      timestamp: Date.now(),
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.body.cafeId);
    if (!cafe) {
      let error = new Error("Cafe bulunamadı");
      utils.helpers.logToError(
        error,
        req,
        "Şarkı Ekleme İşleminde Hata Gerçekleşti"
      );
      res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        success: false,
        error: true,
        timestamp: Date.now(),
        message: error.message,
        code: StatusCodes.BAD_REQUEST,
      });
      return;
    }

    cafe.playlist.push(req.body.songId);
    await cafe.save();

    res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: { message: "Şarkı Eklendi" },
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ...baseResponse,
      success: false,
      error: true,
      timestamp: Date.now(),
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};


  

