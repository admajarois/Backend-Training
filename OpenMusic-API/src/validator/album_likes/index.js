const InvariantError = require('../../exceptions/InvariantError');
const { AlbumLikesPayloadSchema } = require('./schema');


const AlbumLikesValidator = {
    validateAlbumLikePayload: (payload) => {
        const validationResult = AlbumLikesPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};


module.exports = AlbumLikesValidator;

