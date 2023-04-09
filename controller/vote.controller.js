const baseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const Cafe = require("../models/cafe.model");

exports.vote = async function voteForSong(req, res) {
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
      let error = new Error("Cafe bulunamadı");
      utils.helpers.logToError(
        error,
        req,
        "Oy Verme İşleminde Cafe Bulunamadı"
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

    votedSong = cafe.votes.findIndex(
      (vote) => vote.song.toString() === req.body.songId
    );
    
    if (votedSong !== -1) {
      votedUser = cafe.votes[votedSong].user.findIndex(
        (user) => user._id.toString() === req.body.userId
      );
      if (votedUser === -1) {
        cafe.votes[votedSong].user.push(req.body.userId);
        cafe.votes[votedSong].vote++;
      } else {
        let error = new Error("Kullanıcı Zaten Oy Vermiş");
        utils.helpers.logToError(error, req, "Şarkı Oy Vermede Bir Hata Oluştu");
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
    } else {
      cafe.votes.push({
        user: [req.body.userId],
        song: req.body.songId,
        vote: 1,
      });
    }

    await cafe.save();
    res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: cafe,
      success: true,
      timestamp: Date.now(),
      code: StatusCodes.OK,
    });
  } catch (error) {
    utils.helpers.logToError(error, req, "Oy Verme İşleminde Hata Gerçekleşti");
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