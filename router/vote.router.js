const express = require('express')
const router = express.Router()
const controller = require("../controller/vote.controller")
const middlewares = require('../middlewares/index')

router.post('/vote',[middlewares.authMiddleware],controller.vote);


module.exports = {
    voteRouter : router
}