const mapDBToAlbumModel = ({
    id,
    name,
    year,
    created_at,
    updated_at,
}) => ({
    id,
    name,
    year,
});

const mapDBToSongModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
    created_at,
    updated_at,
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id
});

module.exports = {mapDBToAlbumModel, mapDBToSongModel}