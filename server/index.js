const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
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

// MONGODB CONNECTION

// CONNECTION
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
    const bg = db.collection('boggle-games');
    bg.drop();

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
    app.set('bg', bg);
    app.set('cache', cache);
});

// SOCKETS

const io = socketio(app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`)));

io.on('connection', socket => {
    // console.log('sockets connected');
    // CREATE GAME
    socket.on('start game', (game) => {
        console.log('starting game');
        console.log(game);

        if (!game.players) game.players = [game.user];
        
        const bg = app.get('bg');
        bg.insert(game).then(result => {
            console.log(result);
            let game = result.ops[0];
            let id = game._id;
            
            socket.join(id);
            io.to(id).emit('game started', game);
            
        });

    });
    // FIND GAMES
    socket.on('find games', (data) => {
        console.log('finding games');
        console.log(data);

        const room = 'FIND';
        socket.join(room);

        io.to(room).emit('games found', { currentGames: [] });
    });
    // JOIN GAME
    socket.on('join game', (data) => {
        console.log('joining game');
        console.log(data);

        const room = data.game;
        socket.join(room);

        io.to(room).emit('game joined', data);
    });
    //     // END GAME
    //     socket.on('end game', (data) => {
    //         console.log('ending game');
    //         console.log(data);
    //     });
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
        // console.log(results);
        // console.log(JSON.stringify(cache, null, 4));
        res.status(200).send(results);
    }).catch(err => {
        // console.log(err);        
        // console.log(JSON.stringify(cache, null, 4));
        res.status(500).send(err);
    });
});

const path = require('path');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
