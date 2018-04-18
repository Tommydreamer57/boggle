const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const axios = require('axios');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const gameSchema = require('./game-schema');
const Cache = require('./cache');
require('dotenv').config();

const {
    MONGO_URI,
    MONGO_DBNAME,
    OXFORD_APP_ID,
    OXFORD_APP_KEY,
    OXFORD_URL,
    BING_API_KEY_ONE,
    BING_API_KEY_TWO,
    BING_URL
} = process.env

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

const PORT = 3013;

// MONGODB

// MONGOCLIENT CONTROLS WORDS & VALIDATION
MongoClient.connect(MONGO_URI, function (err, client) {
    if (err) {
        console.log(`ERROR CONNECTING TO MONGODB`);
        console.log(err);
    }
    console.log(`${MONGO_DBNAME} connected to server`);
    // DB
    const db = client.db(MONGO_DBNAME);
    // COLLECTIONS
    const ow = db.collection('oxford-words');
    // CACHE
    const cache = new Cache({
        config: {
            headers: {
                APP_ID: OXFORD_APP_ID,
                APP_KEY: OXFORD_APP_KEY
            }
        },
        env: {
            OXFORD_APP_ID,
            OXFORD_APP_KEY,
            OXFORD_URL
        },
        dbCollection: ow
    });
    // ADD INSTANCES TO APP
    app.set('db', db);
    app.set('ow', ow);
    app.set('cache', cache);
});

// MONGOOSE

const LISTENING = app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));

const Game = mongoose.model('Game', gameSchema);

// MONGOOSE CONTROLS GAMES
mongoose.connect(MONGO_URI).then(() => console.log(`MONGOOSE CONNECTED`)).catch(err => console.log('MONGOOSE CONNECTION ERROR ', err));

mongoose.connection.once('open', function () {
    console.log('MONGOOSE CONNECTION OPENED');

    // SOCKETS

    const io = socketio(LISTENING);

    io.on('connection', socket => {
        // CREATE GAME
        socket.on('start game', (game) => {
            console.log('starting game');
            console.log(game);

            if (!game.players || !game.players.length) game.players = [game.user];
            const newGame = new Game(game);
            console.log(newGame);

            const { _id } = newGame;
            socket.join(_id);
            io.to(_id).emit('game started', { joinedGame: newGame });

            // game.date = new Date(Date.now());

            // const bg = app.get('bg');
            // bg.insert(game).then(result => {
            //     console.log(result);
            //     let game = result.ops[0];
            //     let id = game._id;

            //     socket.join(id);
            //     io.to(id).emit('game started', game);

            // });

        });
        // FIND GAMES
        socket.on('find games', (data) => {
            console.log('finding games');
            console.log(data);

            const room = 'FIND';
            socket.join(room);

            Game.find({}, 'board', function (err, games) {
                console.log(`ERROR`);
                console.log(err);
                console.log(`GAMES`);
                console.log(games);
            });

            // const find = Game.find().findAll()
            // .exec(function (err, games) {
            //     console.log(`ERROR`);
            //     console.log(err);
            //     console.log(`GAMES`)
            //     console.log(games);
            // });
            // console.log(find);

            // const bg = app.get('bg');
            // bg.find().toArray().then(currentGames => {

            //     io.to(room).emit('games found', { currentGames });

            // });

        });
        // JOIN GAME
        socket.on('join game', ({ game, user }) => {
            console.log('joining game');
            console.log(game);

            const { _id } = game;
            socket.join(_id);

            // const bg = app.get('bg');
            // bg.find(ObjectId(_id)).toArray().then(({ 0: joinedGame }) => {

            //     console.log(joinedGame);
            //     const { players } = joinedGame;

            //     bg.findOneAndUpdate({ _id }, { $set: { players } }, { returnNewDocument: true }).then(joinedGame => {

            //         console.log(`ADDED USER TO GAME`)
            //         console.log(joinedGame);
            //         io.to(_id).emit('game joined', { joinedGame });

            //     }).catch(console.log);

            // });

        });
        //     // END GAME
        //     socket.on('end game', (data) => {
        //         console.log('ending game');
        //         console.log(data);
        //     });
    });

});

// ENDPOINTS

// GET ALL WORDS
app.get('/api/words', (req, res) => {
    const ow = app.get('ow');
    ow.find().toArray().then(words => {
        res.status(200).send(words);
    }).catch(err => {
        res.status(500).send(err);
    });
});
// GET SPECIFIC WORD
app.get('/api/words/:word', (req, res) => {
    const cache = app.get('cache');
    let word = req.params.word;
    cache.validate(word).then(results => {
        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send(err);
    });
});
// GET DUPLICATES
app.get('/api/duplicates', (req, res) => {
    const ow = app.get('ow');
    ow.find().toArray().then(words => {
        let results = words.filter(word => {
            if (words.filter(item => item === word).length <= 1) return false;
            else return true;
        })
        return res.status(200).send(results);
    });
});
// GET CACHE
app.get('/api/cache', (req, res) => {
    const cache = app.get('cache');
    res.status(200).send(cache.words);
});
// VALIDATE WORDS
app.post('/api/validate', (req, res) => {
    const cache = app.get('cache');
    let { words } = req.body;
    cache.validate(words).then(results => {
        res.status(200).send(results);
    }).catch(err => {
        res.status(500).send(err);
    });
});

const path = require('path');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
