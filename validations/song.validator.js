const { body } = require("express-validator");
const SongValidator = {
  validateSong() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ max: 100 })
        .withMessage("Name should be maximum 100 characters long."),
      body("artist")
        .trim()
        .notEmpty()
        .withMessage("Artist name is required.")
        .isLength({ max: 100 })
        .withMessage("Artist name should be maximum 100 characters long."),
      body("url")
        .trim()
        .notEmpty()
        .withMessage("Song URL is required.")
        .isURL()
        .withMessage("Please provide a valid URL."),
    ];
  },
};

module.exports = SongValidator;
