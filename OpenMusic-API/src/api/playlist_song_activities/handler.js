const autoBind = require("auto-bind");

class PlaylistSongActivitiesHandler {
    constructor(playlistSongActivitiesService, playlistsService, validator) {
        this._playlistSongActivitiesService = playlistSongActivitiesService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        autoBind(this);
    }

    async getPlaylistSongActivitiesHandler(request) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        // Validate playlist ownership before retrieving activities
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        // Get activities from the service
        const activities = await this._playlistSongActivitiesService.getActivities(playlistId);

        return {
            status: 'success',
            data: activities.data,
        };
    }
}

module.exports = PlaylistSongActivitiesHandler;
