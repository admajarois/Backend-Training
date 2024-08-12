const Joi = require("joi");

const PlaylistSongActivityPayloadSchema = Joi.object({
    songId: Joi.string().required(),
    playlistId: Joi.string().required(),
    user_id: Joi.string().required(),
    action: Joi.string().required(),
    time: Joi.string().required(),
});

module.exports = { PlaylistSongActivityPayloadSchema }