const express = require("express");
const router = express.Router();
const controller = require("../controller/cafe.controller");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const validator = require('../validations/cafe.validator')


router.use(express.static('public'));

router.post("/create",[validator.validateCafe(), upload.single('image')],controller.create);
router.post("/addsong", controller.addSongToPlaylist);
router.post("/resetvote", controller.resetVote);


router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', controller.login);
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', controller.create);

router.get('/player', (req, res) => {
  res.render('player');
});



module.exports = {
  cafeRouter: router,
};
