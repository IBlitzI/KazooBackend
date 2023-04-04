const { body } = require("express-validator");
const CafeValidator = {
  validateCafe() {
    return [
      body("name").notEmpty().withMessage("Cafe name is required"),
      body("location")
        .optional({ nullable: true })
        .isString()
        .withMessage("Location should be a string"),
      body("rating")
        .optional({ nullable: true })
        .isNumeric()
        .withMessage("Rating should be a number"),
      body("menu.*.name")
        .isString()
        .withMessage("Menu item name should be a string"),
      body("menu.*.price")
        .isNumeric()
        .withMessage("Menu item price should be a number"),
      body("menu.*.description")
        .isString()
        .withMessage("Menu item description should be a string"),
      body("playlist").isArray().withMessage("Playlist should be an array"),
      body("playlist.*").isMongoId().withMessage("Invalid song ID in playlist"),
    ];
  },
};

module.exports = CafeValidator;
