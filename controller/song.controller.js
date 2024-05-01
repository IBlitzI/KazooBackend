require("dotenv").config();
const BaseResponse = require("../dto/baseResponse.dto");
const Song = require("../models/song.model");
const Cafe = require("../models/cafe.model");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const youtubeService = require('../services/youtube.service');
const spotifyService = require('../services/spotify.service');

exports.create = async (req, res) => {
  try {
    const songName = req.body.name;
    const music = await youtubeService.searchMusicByName5(songName); 
    const existingSong = await Song.findOne({ url: music[0].videoUrl }); // Mevcut şarkıları sorgula

    if (existingSong) {
      // Eğer aynı video URL'sine sahip bir şarkı bulunursa hata döndür
      return res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Aynı video URL\'sine sahip bir şarkı zaten mevcut.'));
    }

    // Eğer mevcut bir şarkı yoksa yeni şarkı oluştur ve kaydet
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


// exports.search = async (req, res) => {
//   try {
//     const songName = req.body.name;
//     const songs = await spotifyService.searchMusicByNameSpotify(songName)
//     //const songs = await youtubeService.searchMusicByName5(songName);
//     res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, songs));
//   } catch (error) {
//     utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkı Ekleme İşleminde Hata Gerçekleşti', error.message));
//   }
// };
//---------------------------------------------------------------------------------------------------------
exports.addPlaylist = async (req, res) => {
  try {
    const playlistId = req.body.playlistId;
    const cafeId = req.body.cafeId;

    const songs = await youtubeService.getPlaylistItems(playlistId);
    const cafe = await Cafe.findById(cafeId);
    
    if (!cafe) {
      let error = new Error("Cafe bulunamadı");
      utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Aktif Kafe Bulunamadı', error.message));
      return;
    }

    // newSong değişkenini döngü dışında tanımla
    let newSong;

    for (const song of songs) {
      const existingSong = await Song.findOne({ videoId: song.videoId });

      if (!existingSong) {
        // Yeni şarkıyı oluştur
        newSong = new Song({
          name: song.title,
          url: song.videoUrl,
          videoId: song.videoId,
          thumbnail: song.thumbnailUrl       
         });
        console.log(newSong)
        await newSong.save();
      } else {
        // Eğer şarkı zaten varsa sadece kafeyi ekleyin
        existingSong.cafe = cafeId;
        await existingSong.save();
      }

      cafe.votes.push({
        user: [],
        song: existingSong ? existingSong._id : newSong._id,
        vote: 0,
      });
    }

    await cafe.save();
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, { message: "Şarkılar Başarıyla Eklendi" }));

  } catch (error) {
    utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkı Eklenemedi', error.message));
  }
};


