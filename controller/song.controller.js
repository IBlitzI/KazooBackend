require("dotenv").config();
const baseResponse = require("../dto/baseResponse.dto");
const Song = require("../models/song.model");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const youtubeService = require('../services/youtube.service');

exports.create = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ ...baseResponse, ...isInvalid });
      return;
    }
    const songName = req.body.name;
    const music = await youtubeService.searchMusicByName(songName);
    const newSong = new Song({
      name: music[0].title,
      url: music[0].videoUrl,
      videoId :music[0].id ,
      thumbnail :music[0].thumbnail
    });

    await newSong.save();
    res.status(StatusCodes.OK).json({
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
