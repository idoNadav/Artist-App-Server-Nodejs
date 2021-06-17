const dbService = require("./DbService");
const uuid = require('uuid');


exports.addArtist = async function (id, name, yearOfBirth, pictureLink) {
    if (await dbService.isArtistExist(id)) {
        throw new Error('Artist with this id is already exist!')
    }
    const newArtist = {
        _id: id,
        name: name,
        yearOfBirth: yearOfBirth,
        pictureLink: pictureLink
    };
    try {
        return await dbService.addArtist(newArtist)
    } catch (err) {
        console.log('Failed to add artist ' + newArtist);
        throw new Error('Failed to add artist ' + newArtist);
    }
}

exports.addSong = async function (songDetails) {
    const artist = await dbService.getArtist(songDetails.artistId);
    if (!artist) {
        throw new Error("Artist with this id isn't exist:" + " " + songDetails.artistId)
    }
    if(await dbService.isSongExist(artist._id,songDetails.name)) {
        throw new Error("Artist with this song is already exist!");
    }

    const newSong = {
        _id: uuid.v1(),
        name: songDetails.name,
        artistId: songDetails.artistId
    };
    try {
        return await dbService.addSong(newSong);
    } catch (err) {
        console.log('Failed to add song ' + newSong);
        throw new Error('Failed to add song ' + newSong);
    }
}

exports.getArtist = async function (artistId) {
    try {
        return await dbService.getArtist(artistId);
    } catch (err) {
        console.log('Failed to get artist ' + artistId);
        throw new Error('Failed to get artist ' + artistId);
    }
}

exports.getAllArtists = async function () {
    try {
        return await dbService.getAllArtists();
    } catch (err) {
        console.log('Failed to get all artists');
        throw new Error('Failed to get all artists');
    }
}

exports.getSongsByArtist = async function (artistId) {
    if (!await dbService.isArtistExist(artistId)) {
        throw new Error("This artist id isn't exist: " + artistId);
    }
    try {
        return await dbService.getSongsByArtist(artistId);
    } catch (err) {
        console.log('Failed to get songs by artist id ' + artistId);
        throw new Error('Failed to get songs by artist id ' + artistId);
    }
}

exports.getAllSongs = async function () {
    try {
        return await dbService.getAllSongs();
    } catch (err) {
        console.log('Failed to get all songs');
        throw new Error('Failed to get all songs');
    }
}

exports.deleteArtist = async function (artistId) {
    if (!await dbService.isArtistExist(artistId)) {
        throw new Error("This artist id isn't exist:" + " " + artistId);
    }
    try {
        return await dbService.deleteArtist(artistId);
    } catch (err) {
        console.log('Failed to delete artist ' + artistId);
        throw new Error('Failed to delete artist ' + artistId);
    }
}

exports.deleteArtistSong = async function (songName, artistId) {
    if (!await dbService.isArtistExist(artistId)) {
        throw new Error("This artist id isn't exist: " + artistId);
    }
    if(songName === null || songName === undefined){
        throw new Error("Invalid input song name!");
    }
    if(!await dbService.isSongExist(artistId, songName)){
        throw new Error("This artist does not have a song by name: " + songName);
    }

    try {
        const artist = await dbService.getArtist(artistId);

        if(songName.toLowerCase() === "all"){
            await dbService.deleteALLSongs(artistId);
            await dbService.deleteAllSongsFromArtistList(artistId);
            console.log("All songs by "+ artist.name + " deleted successfully!");
        } else {
            const songDetails = await dbService.getSong(songName, artistId);
            await dbService.deleteSongByName(songDetails,artistId);
            console.log("The song " + songName + " by " + artist.name+" has been deleted!");
        }
    } catch (err) {
        console.log('Failed to delete song ' + songName + ' from artist ' + artistId);
        throw new Error('Failed to delete song ' + songName + ' from artist ' + artistId);
    }
}
