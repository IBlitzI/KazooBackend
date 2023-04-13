const express = require("express");
const router = express.Router();
const controller = require("../controller/cafe.controller");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.single('image'),controller.create);
router.post("/addsong", controller.addSongToPlaylist);

module.exports = {
  cafeRouter: router,
};
