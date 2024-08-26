const InvariantError = require('../../exceptions/InvariantError');
const { AlbumCoversSchema } = require('./schema');

const UploadsValidator = {
    validateAlbumCovers: (covers) => {
        const validationResult = AlbumCoversSchema.validate(covers);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UploadsValidator;