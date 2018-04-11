const express = require('express');
const bodyParser = require('body-parser');
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

// COLLECTION
const collection = 'boggle';

// CONNECTION
MongoClient.connect(MONGO_URI, function (err, client) {
    if (err) {
        console.log(`ERROR CONNECTING TO MONGODB`);
        console.log(err);
    }
    const db = client.db(MONGO_DBNAME);
    app.set('db', db);
    // OXFORD
    const config = {
        headers: {
            APP_ID: OXFORD_APP_ID,
            APP_KEY: OXFORD_APP_KEY
        }
    }
    // ENV
    const env = {
        OXFORD_APP_ID,
        OXFORD_APP_KEY,
        OXFORD_URL
    }
    // CACHE
    const cache = new Cache({ config, db, collection, env });
    app.set('cache', cache);
    console.log(`${MONGO_DBNAME} connected to server`);
    app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));
});

// ENDPOINTS

// GET ALL WORDS
app.get('/api/words', (req, res) => {
    const db = app.get('db');
    db.collection(collection).find().toArray().then(words => {
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
    const db = app.get('db');
    db.collection(collection).find().toArray().then(words => {
        let results = words.filter(word => {
            if (words.filter(item => item === word).length <= 1) return false;
            else return true;
        })
        return res.status(200).send(results);
    });
});
// GET CACHE
app.get('/api/cache', (req, res) => {
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
