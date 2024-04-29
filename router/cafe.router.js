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
router.get('/getcafe', controller.getcafe);
router.put('/upgrademenu', controller.upgradeMenu);




module.exports = {
  cafeRouter: router,
};
