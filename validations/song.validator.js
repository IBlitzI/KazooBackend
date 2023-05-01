const { body } = require('express-validator');

const SongValidator = {
  validateSong() {
    return [
      body('name').notEmpty().withMessage('Name field is required'),
      body('artist').optional().notEmpty().withMessage('Artist field should not be empty'),
      body('url').notEmpty().withMessage('URL field is required'),
      body('thumbnail').notEmpty().withMessage('Thumbnail field is required'),
      body('videoId').notEmpty().withMessage('Video ID field is required'),
    ];
  },
};

module.exports = SongValidator;
