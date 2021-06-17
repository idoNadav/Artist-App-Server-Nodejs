const mongoDb = require('../DB/DbConnection');
const artistSchema = require('../DB/schemas/artistSchema');
const songSchema = require('../DB/schemas/SongSchema')
mongoDb().then(r => console.log('Connected database...'));


exports.isArtistExist = async function (id) {
    try {
        const result = await artistSchema.findOne({_id: id})
        return !!result;
    } catch (err) {
        console.log("[isArtistExist] Failed to get artist by id- DB error")
        throw err;
    }
}

exports.isSongExist = async function (artistId , songName) {
    try {
        return await songSchema.findOne({artistId:artistId , name:songName});
    } catch (err) {
        console.log("[isSongExist] Failed to get song by artist id - DB error")
        throw err;
    }
}

exports.addArtist = async function (artistDetails) {
    try {
        return await new artistSchema(artistDetails).save();
    } catch (err) {
        console.log("[addArtist] Failed to save artist - DB error")
        console.log(err)
        throw err;
    }
}

exports.addSong = async function(songDetails) {
    try {
        await new songSchema(songDetails).save();
        await artistSchema.findByIdAndUpdate({_id:songDetails.artistId},{$addToSet:{songsId:songDetails._id}})
        return songDetails;
    } catch (err) {
        console.log("[addSong] Failed to add song to artist - DB error")
        throw err;
    }
}

exports.getArtist = async function (artistId) {
    try {
        return await artistSchema.findOne({_id:artistId});
    } catch (err) {
        console.log("[getArtist] Failed to get artist by id- DB error")
        throw err;
    }
}

exports.getAllArtists = async function () {
    try {
        return  await artistSchema.find({}).sort('name');
    } catch (err) {
        console.log("[getAllArtists] Failed to get all artists - DB error")
        throw err;
    }
}

exports.getSong = async function (songName,artistId) {
    try {
        return await songSchema.findOne({name:songName},{artistId:artistId});
    } catch (err) {
        console.log("[getSong] Failed to get song by artist id - DB error")
        throw err;
    }
}

exports.getSongsByArtist = async function(artistId){
    try {
        return await songSchema.find({artistId:artistId}).sort('name');
    } catch (err) {
        console.log("[getSongsByArtist] Failed to get songs by artist id - DB error")
        throw err;
    }
}

exports.getAllSongs = async function () {
    try {
        return await songSchema.find({});
    } catch (err) {
        console.log("[getAllSongs] Failed to get all songs - DB error")
        throw err;
    }
}

exports.deleteArtist = async function(artistId){
    try {
        await this.deleteALLSongs(artistId);
        return await artistSchema.findByIdAndDelete({_id: artistId});
    }catch (err){
        console.log("[deleteArtist] Failed to delete artist by artists id - DB error")
        throw err;
    }
}

exports.deleteSongByName = async function(songDetails,artistId){
    try {
        await this.deleteSongFromArtistList(artistId,songDetails)
        return await songSchema.deleteOne({_id:songDetails._id});
    }catch (err){
        console.log("[deleteSongByName] Failed to delete song by name - DB error")
        throw err
    }
}

exports.deleteALLSongs = async function(artistId){
    try {
        return await songSchema.deleteMany({artistId:artistId})
    }catch (err){
        console.log("[deleteALLSongs] Failed to delete all songs by artist - DB error")
        throw err
    }
}

exports.deleteSongFromArtistList = async function(artistId, songName){
    try {
        await artistSchema.findByIdAndUpdate({_id:artistId},{$pull:{songsId:songName._id}})
    } catch (err){
        console.log("[deleteSongFromArtistList] Failed to delete song from artist list - DB error")
        throw err;
    }
}


exports.deleteAllSongsFromArtistList = async function(artistId){
    try {
        await artistSchema.updateMany({_id:artistId},{"$unset":{"songsId":1}})
    }catch (err){
        console.log("[deleteAllSongsFromArtistList] Failed to delete all songs from artist list - DB error")
        throw err;
    }
}
