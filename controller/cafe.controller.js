require("dotenv").config();
const Cafe = require("../models/cafe.model");
const Song = require("../models/song.model");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils/index");
const BaseResponse = require("../dto/baseResponse.dto");
const bcrypt = require("bcrypt");


exports.create = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Validation error', isInvalid));
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const cafeImage = req.file.buffer;
    const newCafe = new Cafe({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.cafeName,
      location: req.body.location,
      image: { data: cafeImage, contentType: req.file.mimetype },
    });
    // const votesArr = JSON.parse(req.body.playlist);
    // votesArr.forEach(async (song) => {
    //   newCafe.votes.push({ user: [], song, vote: 0 });
    // });
    await newCafe.save();

    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, newCafe.id));
  } catch (error) {
    utils.helpers.logToError(
      error, req, "Cafe Ekleme İşleminde Hata Gerçekleşti");
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Cafe Eklenemedi', error.message));
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.body.cafeId);
    if (!cafe) {
      let error = new Error("Cafe bulunamadı");
      utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Aktif Kafe Bulunamadı', error.message));
      return;
    }

    cafe.votes.push({
      user: [],
      song: req.body.songId,
      vote: 0,
    });
    await cafe.save();
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode, { message: "Şarkı Başarıyla Eklendi" }));

  } catch (error) {
    utils.helpers.logToError(error, req, "Şarkı Ekleme İşleminde Hata Gerçekleşti");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Şarkı Eklenemedi', error.message));
  }
};
exports.login = async (req, res) => {
  try {
    const isInvalid = utils.helpers.handleValidation(req);
    if (isInvalid) {
      res.status(StatusCodes.BAD_REQUEST).send(BaseResponse.error(res.statusCode, 'Validation error', isInvalid));
      return;
    }

    const cafe = await Cafe.findOne({ username: req.body.username });
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      cafe.password
    );


    if (!cafe && !passwordMatch) {
      let error = new Error("Incorrect Username or Password");
      utils.helpers.logToError(error, req);
      res.status(StatusCodes.UNAUTHORIZED).send(BaseResponse.error(res.statusCode, 'Giriş Yapılamadı', error.message));
       return;
    }
     res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode));
  } catch (error) {
    utils.helpers.logToError(error, req, "Cafe login işleminde hata gerçekleşti");
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(BaseResponse.error(res.statusCode, 'Giriş Yaparken Hata Oluştu', error.message));
  }
};

exports.resetVote = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.body.cafeId);

    const song = await Song.findOne({ videoId: req.body.videoId });

    const votes = cafe.votes.filter(vote => vote.song.equals(song._id));
    votes.forEach(vote => {
      vote.vote = 0;
    });
    await cafe.save();
  } catch (err) {
    console.error(err);
  }
}
exports.getcafe = async (req, res) => {
  try {
    const cafes = await Cafe.find({}, { name: 1});
    const data = cafes.map(cafe => ({
      name: cafe.name,
      // image: cafe.image && cafe.image.data.toString('base64'),
      // location:cafe.location
    }));
    res.status(StatusCodes.OK).send(BaseResponse.success(res.statusCode,data));
  } catch (error) {
    console.error(error);
  }
}
exports.upgradeMenu = async (req, res) => {
  try {
    // Cafe ID'sini isteğin params'ından al
    const { cafeId } = req.body;

    // Güncellenecek menüyü istek gövdesinden al
    const updatedMenu = req.body.menu;

    // Cafe'yi veritabanından bul ve güncellenmiş menüyü ayarla
    const cafe = await Cafe.findByIdAndUpdate(cafeId, { menu: updatedMenu }, { new: true });

    // Cafe bulunamazsa hata gönder
    if (!cafe) {
      return res.status(StatusCodes.NOT_FOUND).json(BaseResponse.error(res.statusCode, 'Cafe not found'));
    }

    // Başarıyla güncellenmiş cafe'yi gönder
    res.status(StatusCodes.OK).json(BaseResponse.success(res.statusCode, 'Menu upgraded', cafe));
  } catch (error) {
    // Hata oluşursa hata mesajı gönder
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(BaseResponse.error(res.statusCode, 'Error upgrading menu', error.message));
  }
};