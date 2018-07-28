// DEPENDENCIES
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const axios = require('axios');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
// CACHE
const Cache = require('./classes/cache');
// CONTROLLERS
const wctrl = require('./controllers/word-controller');
const gctrl = require('./controllers/game-controller');
const rctrl = require('./controllers/room-controller');
// ENV
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
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use((req, res, next) => {
    console.log(req.body);
    next();
});

const PORT = 3013;

// MONGODB

MongoClient.connect(MONGO_URI, function (err, client) {
    if (err) console.log(`ERROR CONNECTING TO MONGODB`, err);
    else console.log(`${MONGO_DBNAME} connected to server`);
    // DB
    const db = client.db(MONGO_DBNAME);
    // COLLECTIONS
    // db.collection('boggle-games').drop();
    const ow = db.collection('oxford-words');
    const bg = db.collection('boggle-games');
    // CACHE
    const cache = new Cache({
        config: { headers: { APP_ID: OXFORD_APP_ID, APP_KEY: OXFORD_APP_KEY } },
        env: { OXFORD_APP_ID, OXFORD_APP_KEY, OXFORD_URL },
        dbCollection: ow
    });
    // ADD INSTANCES TO APP
    app.set('db', db);
    app.set('ow', ow);
    app.set('bg', bg);
    app.set('cache', cache);

    // LISTENING
    const server = app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));

    // SOCKETS
    const io = socketio(server);

    io.on('connection', socket => {
        // console.log('SOCKET');
        // console.log(Object.keys(socket));
        // console.log('ROOMS');
        // console.log(socket._rooms);
        // console.log('CONNECTED');
        // console.log(socket.connected);
        // console.log('DISCONNECTED');
        // console.log(socket.disconnected);
        // console.log('HANDSHAKE');
        // console.log(socket.handshake);
        // JOIN ROOM
        socket.on('join room', rctrl.joinRoom.bind({ socket }));
        // LEAVE ROOM
        socket.on('leave room', rctrl.leaveRoom.bind({ socket }));
        // CREATE GAME
        socket.on('create game', gctrl.createGame.bind({ app, socket, io }));
        // FIND GAMES
        socket.on('find games', gctrl.findGames.bind({ app, socket, io }));
        // JOIN GAME
        socket.on('join game', gctrl.joinGame.bind({ app, socket, io }));
        // START GAME
        socket.on('start game', gctrl.startGame.bind({ app, socket, io }));
        // SAVE WORDS
        socket.on('save words', gctrl.saveWords.bind({ app, socket, io }));
        // END GAME
        socket.on('end game', gctrl.endGame.bind({ app, socket, io }));
    });

    // ENDPOINTS

    // GAME ENDPOINTS
    app.get('/api/games', (req, res) => {
        const bg = app.get('bg');
        bg.find().toArray().then(games => {
            res.status(200).send(games);
        }).catch(err => {
            console.log(err);
        });
    });

    // GET ALL WORDS
    app.get('/api/words', wctrl.getAllWords);
    // GET DUPLICATES
    app.get('/api/duplicates', wctrl.getDuplicates);
    // GET CACHE
    app.get('/api/cache', wctrl.getCache);
    // GET SPECIFIC WORD
    app.get('/api/words/:word', wctrl.validateOne);
    // VALIDATE WORDS
    app.post('/api/validate', wctrl.validateMany);

    const path = require('path');

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });

});
