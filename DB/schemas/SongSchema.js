const mongoose = require('mongoose');

const songsSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    artistId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('songs', songsSchema);
