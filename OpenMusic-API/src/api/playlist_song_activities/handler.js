class PlaylistSongActivitiesHandler {
    constructor(playlistSongActivitiesService, playlistsService, validator) {
        this._playlistSongActivitiesService = playlistSongActivitiesService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postPlaylistSongActivitiesHandler = this.postPlaylistSongActivitiesHandler.bind(this);
        this.getPlaylistSongActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
    }

    async postPlaylistSongActivitiesHandler(request, h) {
        const { id: playlistId } = request.params;
        const { songId, action } = request.payload;
        const { id: userId } = request.auth.credentials;

        // Validate playlist ownership before adding the activity
        await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

        // Add activity to the service
        await this._playlistSongActivitiesService.addActivity(playlistId, songId, userId, action);

        const response = h.response({
            status: 'success',
            message: 'Activity has been added to the playlist',
        });
        response.code(201);
        return response;
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
