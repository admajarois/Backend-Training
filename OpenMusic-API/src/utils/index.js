const mapDBToAlbumModel = ({
    id,
    name,
    year,
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