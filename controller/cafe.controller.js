require("dotenv").config();
const Cafe = require("../models/cafe.model");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const baseResponse = require("../dto/baseResponse.dto");


exports.create = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ ...baseResponse, ...isInvalid });
      return;
    }
    const cafeImage = req.file.buffer;
    const newCafe = new Cafe({
      name: req.body.name,
      location: req.body.location,
      image: { data: cafeImage, contentType: req.file.mimetype },
    });
    const votesArr = JSON.parse(req.body.playlist);
    votesArr.forEach(async (song) => {
      newCafe.votes.push({ user: [], song, vote: 0 });
    });
    await newCafe.save();

    res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: newCafe.id,
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
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ ...baseResponse, ...isInvalid });
      return;
    }
    const cafe = await Cafe.findById(req.body.cafeId);
    if (!cafe) {
      let error = new Error("Cafe bulunamadı");x
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

    cafe.votes.push({
      user: [],
      song: req.body.songId,
      vote: 0,
    });
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
