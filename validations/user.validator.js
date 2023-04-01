const { body } = require('express-validator')
const UserValidator = {
    validateUserEmail() {
        return [body('email').isEmail().withMessage('e mail geçersiz')]
    },
}

module.exports = UserValidator