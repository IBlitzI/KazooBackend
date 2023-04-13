const baseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const Cafe = require("../models/cafe.model");
const User = require("../models/user.model");

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

    const user = await User.findById(req.body.userId);
   
  
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
    await user.save();
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

exports.mostVoted = async function getMostVotedSong(req, res) {
  const cafeId = req.body.cafeId;

  try {
    const cafe = await Cafe.findById(cafeId).exec();
    if (!cafe) {
      return res.status(404).send("Cafe not found");
    }

    cafe.votes.sort((a, b) => b.vote - a.vote); // sort by vote in descending order

    if (cafe.votes.length === 0) {
      return res.status(404).send("No votes found");
    }
    console.log('cafe', cafe)
    const songId = cafe.votes[0].song;
    const song = await Song.findById(songId).exec();
    if (!song) {
      return res.status(404).send("Song not found");
    }
    res.send(song.url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}


exports.listAllSongsByVotes = async function(req, res) {
  const cafeId = req.body.cafeId;

  try {
    const cafe = await Cafe.findById(cafeId).populate("votes.song").exec();
    if (!cafe) {
      return res.status(404).send("Cafe not found");
    }
    cafe.votes.sort((a, b) => b.vote - a.vote);

    const songsWithVotes = cafe.votes.map(vote => ({
      song: vote.song,
      votes: vote.vote
    }));

    res.send(songsWithVotes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};