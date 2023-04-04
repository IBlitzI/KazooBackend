const { body } = require("express-validator");
const UserValidator = {
  validateUser() {
    return [
      body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username should be between 3 and 30 characters")
        .matches(/^\w+$/)
        .withMessage(
          "Username should only contain alphanumeric characters and underscores"
        )
        .bail()
        .custom(async (value, { req }) => {
          const user = await req.db.User.findOne({ username: value });
          if (user) {
            throw new Error("Username already exists");
          }
          return true;
        }),
      body("firstName").notEmpty().withMessage("First name is required"),
      body("lastName").notEmpty().withMessage("Last name is required"),
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom(async (value, { req }) => {
          const user = await req.db.User.findOne({ email: value });
          if (user) {
            throw new Error("Email already exists");
          }
          return true;
        }),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password should be at least 8 characters"),
      body("favorites").isArray().withMessage("Favorites should be an array"),
      body("favorites.*.name")
        .isString()
        .withMessage("Favorite name should be a string"),
      body("favorites.*.url").isURL().withMessage("Invalid favorite URL"),
    ];
  },
};

module.exports = UserValidator;
