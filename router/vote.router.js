const express = require("express");
const router = express.Router();
const controller = require("../controller/vote.controller");
const middlewares = require("../middlewares/index");
const validator = require("../validations/user.validator");


router.post("/vote", [middlewares.authMiddleware], controller.vote);

module.exports = {
  voteRouter: router,
};
