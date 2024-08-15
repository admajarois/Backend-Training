const autoBind = require("auto-bind");

class PlaylistSongActivitiesHandler {
    constructor(activitiesService, playlistsService) {
        this._activitiesService = activitiesService;
        this._playlistsService = playlistsService;

        autoBind(this);
    }

    async getPlaylistSongActivitiesHandler(request) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        // Validate playlist ownership before retrieving activities
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        // Get activities from the service
        const activities = await this._activitiesService.getActivities(playlistId);

        return {
            status: 'success',
            data: activities
        };
    }
}

module.exports = PlaylistSongActivitiesHandler;
