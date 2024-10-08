require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

/**albums */
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumService');
const AlbumsValidator = require('./validator/albums');
const ClientError = require('./exceptions/ClientError');

/**songs */
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

/**users */
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

/**playlists */
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');
const playlists = require('./api/playlists');

/**playlist song */
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongValidator = require('./validator/playlist_songs');
const playlistSongs = require('./api/playlist_songs');

/**authentications */
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsServices');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

/**collaborations */
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');

/** playlist song activities */
const playlistSongActivities = require('./api/playlist_song_activities');
const PlaylistSongActivitiesService = require('./services/postgres/PlaylistSongActivitiesService');

/**Export */
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

/** Album likes */
const albumLike = require('./api/album_likes');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');
const AlbumLikevalidator = require('./validator/album_likes');

/**Uploads */
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

/** cache */
const CacheService = require('./services/redis/CacheService');


const init = async () => {
    const cacheService = new CacheService();
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService();
    const playlistSongsService = new PlaylistSongsService();
    const collaborationsService = new CollaborationsService();
    const activitiesService = new PlaylistSongActivitiesService();
    const albumLikesService = new AlbumLikesService(albumsService, cacheService);
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        }
    ]);

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });    

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistValidator,
            }
        },
        {
            plugin: playlistSongs,
            options: {
                playlistSongsService,
                activitiesService,
                validator: PlaylistSongValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                usersService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: playlistSongActivities,
            options: {
                activitiesService,
                playlistsService,
            }
        },
        {
            plugin: _exports,
            options: {
                ProducerService,
                playlistsService,
                validator: ExportsValidator,
            },
        },
        {
            plugin: albumLike,
            options: {
                service: albumLikesService,
                validator: AlbumLikevalidator,
            }
        },
        {
            plugin: uploads,
            options: {
                storageService,
                albumsService,
                validator: UploadsValidator,
            },
        },
    ]);


    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });

            newResponse.code(response.statusCode);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
}


init();