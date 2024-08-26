const mapDBToAlbumModel = ({
    id,
    name,
    year,
    cover,
}) => ({
    id,
    name,
    year,
    cover,
});

const mapDBToSongModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
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