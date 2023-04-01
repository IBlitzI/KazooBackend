const express = require('express')
const router = express.Router()
const controller = require("../controller/user.controller")
const validator = require('../validations/user.validator')
const middlewares = require('../middlewares/index')

router.post("/create", [validator.validateUserEmail()],controller.create);
router.post("/login",[middlewares.loggerMiddleware],controller.login);
router.delete('/logout', controller.logout);

module.exports = {
    userRouter : router
}