const express = require('express')
const router = express.Router()
const controller = require("../controller/cafe.controller")

router.post("/create",controller.create);
router.post("/addsong",controller.addSongToPlaylist);


module.exports = {
    cafeRouter : router
}