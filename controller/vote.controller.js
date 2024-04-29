const BaseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const Cafe = require("../models/cafe.model");
const User = require("../models/user.model");

exports.vote = async function voteForSong(req, res) {
  try {
    const user = await User.findById(req.body.userId);
    const cafe = await Cafe.findById(req.body.cafeId);
    if (!cafe && !user) {
      let error = new Error("Cafe veya User bulunamadı");
      utils.helpers.logToError(error, req, "Oy Verme İşleminde Cafe veya User Bulunamadı");
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Aktif Kafe veya Kullanıcı Bulunamadı', error.message));
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
        user.vote += 1;

      } else {
        if (user.cemil > 0) {
          cafe.votes[votedSong].user.push(req.body.userId);
          cafe.votes[votedSong].vote++;
          user.vote += 1;
        } else {
          let error = new Error("Kullanıcı Zaten Oy Vermiş");
          utils.helpers.logToError(error, req, "Şarkı Oy Vermede Kullanıcı Zaten Oy Vermiş");
          res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Kullanıcı Oy Vermiş', error.message));
          return;
        }
      }
    } else {
      cafe.votes.push({
        user: [req.body.userId],
        song: req.body.songId,
        vote: 1,
      });
    }
    await user.save();
    await cafe.save();
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, cafe.votes));
  } catch (error) {
    utils.helpers.logToError(error, req, "Oy Verme İşleminde Hata Gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Oy Verme İşleminde Hata', error.message));
  }
};


exports.listAllSongsByVotes = async function (req, res) {
  const cafeId = req.body.cafeId;
  try {
    const cafe = await Cafe.findById(cafeId).populate("votes.song").exec();
    if (!cafe) {
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Aktif Kafe Bulunamadı'));
    }
    cafe.votes.sort((a, b) => b.vote - a.vote);

    const songsWithVotes = cafe.votes.map(vote => ({
      song: vote.song,
      votes: vote.vote
    }));
    res.send(songsWithVotes);

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkıları Listelemede Hata', error.message));
  }
};