const mongoose = require('mongoose');
const { Schema } = mongoose;

// SCHEMA
const gameSchema = new Schema({
    board: [[String]],
    dimension: Number,
    user: {
        name: String
    },
    players: [
        {
            name: String,
            points: Number,
            words: [String]
        }
    ],
    date: { type: Date, default: Date.now }
});

// METHODS
gameSchema.methods.addPlayer = function (cb) {
    
};
gameSchema.methods.finish = function (cb) {

};

// STATIC
gameSchema.statics.findById = function (_id, cb) {
    return this.find({ _id }, cb);
};
gameSchema.query.findAll = function (cb) {
    return this.find({}, cb);
}

// EXPORTS
module.exports = gameSchema;
