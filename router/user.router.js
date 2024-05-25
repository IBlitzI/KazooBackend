const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller");
const validator = require("../validations/user.validator");
const middlewares = require("../middlewares/index");

router.post("/localcreate", [validator.validateUser()], controller.localCreate);
router.post("/googlelogin",controller.googleLogin);
router.post("/login", controller.login);
router.delete("/logout", controller.logout);

module.exports = {
  userRouter: router,
};


router.post("/users", async (req, res) => {
  const {userId,updates} = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});