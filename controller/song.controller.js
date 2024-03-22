require("dotenv").config();
const BaseResponse = require("../dto/baseResponse.dto");
const Song = require("../models/song.model");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const youtubeService = require('../services/youtube.service');
const spotifyService = require('../services/spotify.service');

exports.create = async (req, res) => {
  try {
    const songName = req.body.name;
    const music = await youtubeService.searchMusicByName5(songName); 
    const newSong = new Song({
      name: music[0].title,
      url: music[0].videoUrl,
      videoId: music[0].id,
      thumbnail: music[0].thumbnail
    });

    await newSong.save();
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, newSong));
  } catch (error) {
    utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkı Ekleme İşleminde Hata Gerçekleşti', error.message));
    console.log(error);
  }
};

exports.search = async (req, res) => {
  try {
    const songName = req.body.name;
    const songs = await spotifyService.searchMusicByNameSpotify(songName)
    //const songs = await youtubeService.searchMusicByName5(songName);
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, songs));
  } catch (error) {
    utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkı Ekleme İşleminde Hata Gerçekleşti', error.message));
  }
};

exports.searchPlaylist = async (req, res) => {
  try {
    const playlistId = req.body.playlistId;
    
    //const songs = await youtubeService.getPlaylistItems(playlistId);
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, songs));
  } catch (error) {
    utils.helpers.logToError(error, req, "Şarkı Arama İşleminde Hata Gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkı Arama İşleminde Hata Gerçekleşti', error.message));
  }
};

