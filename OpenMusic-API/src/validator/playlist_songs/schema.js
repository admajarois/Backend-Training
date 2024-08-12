const Joi = require("joi");

const PlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
    playlistId: Joi.string().required(),
})

module.exports = { PlaylistSongPayloadSchema }