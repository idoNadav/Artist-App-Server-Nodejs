const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true , 'Please enter an id'],
    },
    name: {
        type: String,
        required: [true , 'Please enter an name'],
    },
    yearOfBirth: {
        type: String,
        required: [true , 'Please enter an year of birth'],
        minlength:[4,"Year of birth must be include 4 digit"],
        maxlength:[4,"Year of birth must be include 4 digit"],
    },
    pictureLink: {
        type: String,
        required: [true , 'Please enter an picture link'],
    },
    songsId:[String]
});

module.exports = mongoose.model('artists', artistSchema);

