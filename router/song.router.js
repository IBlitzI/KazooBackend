const express = require("express");
const router = express.Router();
const controller = require("../controller/song.controller");
const validator = require('../validations/song.validator')

router.post("/create",[validator.validateSong()], controller.create);
// router.post("/search", controller.search);
// router.post("/searchplaylist", controller.searchPlaylist);

module.exports = {
  songRouter: router,
};
