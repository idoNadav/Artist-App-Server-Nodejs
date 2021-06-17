const express = require('express');
const artistService = require("../Services/ArtistsService")
const validator = require('argument-validator');
const router = express.Router();
const isImageURL = require('image-url-validator').default;

router.post('/addArtist', async (req, res) => {
    try {
        validateStringParam ("name", req.body.name, res);
        validateStringParam ("id", req.body.id, res);
        validateStringParam ("yearOfBirth", req.body.yearOfBirth, res);
        validateStringParam ("pictureLink", req.body.pictureLink, res);
    }catch (err){
        console.log(err.message);
        res.status(400);
        res.send(err.message);
        return;
    }
    try {
       validateNumber("id", req.body.id, res);
       validateNumber("yearOfBirth", req.body.yearOfBirth, res);
       await validateImageUrl(req.body.pictureLink, res);
    }catch (err){
        console.log(err.message);
        res.status(400);
        res.send(err.message);
        return;
    }
    try {
        res.send(await artistService.addArtist(req.body.id, req.body.name, req.body.yearOfBirth, req.body.pictureLink)).status(201);
    } catch (err) {
        console.log(err.message);
        res.status(400);
        res.send(err.message);
        return;
    }
});

router.get('/getArtists', async (req, res) => {
    try {
        res.status(200).send(await artistService.getAllArtists());
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

router.get('/getArtist/:artistId', async (req, res) => {
    validateNumber("artistId", req.params['artistId'], res);
    try {
        res.status(200).send(await artistService.getArtist(req.params['artistId']));
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

router.get('/getSongsByArtist/:artistId', async (req, res) => {
    validateNumber("artistId", req.params['artistId'], res);
    try {
        res.status(200).send(await artistService.getSongsByArtist(req.params['artistId']));
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

router.get('/getSongs', async (req, res) => {
    try {
        res.status(200).send(await artistService.getAllSongs());
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

router.delete('/deleteArtist/:artistId', async (req, res) => {
    validateNumber("artistId", req.params['artistId'], res);
    try {
        res.status(200).send(await artistService.deleteArtist(req.params['artistId']));
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

router.delete('/deleteArtistSong/:songName/:artistId', async (req, res) => {
    validateNumber("artistId", req.params['artistId'], res);
    try {
        res.status(200).send(await artistService.deleteArtistSong(req.params['songName'],req.params['artistId'] ));
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

router.post('/addSong', async (req, res) => {
    validateStringParam ("name", req.body.name, res)
    validateStringParam ("artistId", req.body.artistId, res)
    validateNumber("artistId", req.body.artistId, res);
    try {
        const songDetails = req.body;
        res.status(201).send(await artistService.addSong(songDetails));
    } catch (err) {
        console.log(err.message);
        res.status(500);
        res.send(err.message);
        return;
    }
});

async function validateImageUrl(url,res) {
    const isValidUrl = await isImageURL(url).then(result => {
        return result !== false;
    });
    if(!isValidUrl){
        res.status(400);
        res.send("Invalid input: image url is wrong!");
        throw new Error("Invalid input: image url is wrong!");
    }
    const isValid = /\.jpe?g$/i.test(url);
    if (!isValid) {
        res.status(400);
        res.send('Invalid input: Only jpg files allowed!');
        throw new Error('Invalid input: Only jpg files allowed!');
    }
}

function validateStringParam (paramKey, paramValue, res) {
    try {
        validator.string(paramValue, paramKey);
    }catch (err) {
        console.log("invalid input: " + paramKey + " is missing or invalid " + err.message);
        res.status(400);
        res.send("invalid input: " + paramKey + " is missing or invalid");
        throw new Error("invalid input: " + paramKey + " is missing or invalid");
    }
}

function validateNumber(paramKey, paramValue, res){
    if (isNaN(paramValue)){
        res.status(400);
        res.send("Invalid input: " + paramKey +" must be contain only numbers!");
        throw new Error("Invalid input: " + paramKey +" must be contain only numbers!");
    }
    if(paramKey === 'yearOfBirth'){
        if(paramValue.length > 4 || paramValue.length < 4){
            res.status(400);
            res.send("Invalid input: " + paramKey +" must be between 1000 to 9999");
            throw new Error("Invalid input: " + paramKey +" must be between 1000 to 9999");
        }
    }
    return true;
}

module.exports = router;
