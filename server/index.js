const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
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
    if (err) console.log(err);
    const db = client.db(MONGO_DBNAME);
    db.collection('boggle-words').drop();
    app.set('db', db);
    // console.log(db.listCollections({}));
    console.log(`${MONGO_DBNAME} connected to server`);
    app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));
});

// OXFORD
const config = {
    headers: {
        APP_ID: OXFORD_APP_ID,
        APP_KEY: OXFORD_APP_KEY
    }
}

const cache = {
    words: [
        {
            value: "CACHE",
            defined: true
        }
    ],
    currentRequestId: -1,
    currentRequests: [
        {
            id: -1,
            value: "WORD",
            promise: new Promise(resolve => {
                setTimeout(() => {
                    cache.currentRequests.splice(0, 1);
                    resolve();
                }, 0);
            })
        }
    ],
    cacheRequest(promise, wordString) {
        if (this.currentRequests.includes(promise)) return;
        // console.log(promise);
        // console.log(this.currentRequests);
        if (typeof wordString === 'object') wordString = wordString.value;
        const id = this.currentRequestId++;
        const value = wordString.toUpperCase();
        const request = {
            id,
            value,
            promise
        }
        function removeCachedRequest(response) {
            this.currentRequests.splice(this.currentRequests.indexOf(request), 1);
            return response;
        }
        promise.then(removeCachedRequest.bind(this));
        this.currentRequests.push(request);
    },
    cacheWord(word) {
        const { value, defined } = word;
        // CHECK IF ALREADY CACHED
        if (this.words.find(cachedWord => cachedWord.value.toUpperCase() === value.toUpperCase() && cachedWord.defined === defined)) {
            return;
        }
        else {
            // ONLY ADD VALUE AND DEFINED PROPERTIES
            this.words.push({ value, defined });
        }
    },
    find(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        // console.log(words);
        // const results =
        return words.map(wordString => {
            return this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
        });
        // return Promise.all(results);
    },
    validate(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        // console.log(words);
        const validations = words.map(word => word.toUpperCase()).map(wordString => {
            // CHECK CACHE FOR WORD
            const cachedWord = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
            if (cachedWord) {
                // console.log(`FOUND CACHED WORD: ${wordString} - ${cachedWord.defined}`);
                return cachedWord;
            }
            else {
                // CHECK CACHE FOR CURRENT REQUESTS
                let request = this.currentRequests.find(request => request.value.toUpperCase() === wordString.toUpperCase());

                if (request) {
                    // console.log(`AWAITING WORD: ${wordString}`);
                    request = request.promise;
                }
                else {
                    // CHECK DB FOR WORD
                    const db = app.get('db');
                    const collection = 'boggle-words';
                    const query = { value: wordString }
                    const word = db.collection(collection).count(query).then(count => {
                        // console.log(count);
                        if (count) {
                            // console.log(`FOUND DB WORD: ${wordString}`);
                            // RETURN WORD FROM DB
                            const cursor = db.collection(collection).find(query);
                            const word = cursor.next();
                            // console.log(word);
                            return word;
                        }
                        else {
                            // FETCH WORD FROM OXFORD
                            const url = `${OXFORD_URL}/search/en?q=${wordString.toLowerCase()}`;
                            // console.log(`FETCHING WORD: ${wordString}`);
                            request = axios.get(url, config).then(response => {
                                // CHECK IF THE WORD HAS BEEN FOUND
                                var word = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
                                if (word) {
                                    // console.log(`FOUND CACHED WORD AFTER OXFORD SEARCH: ${wordString} - ${word.defined}`);
                                    return word;
                                }
                                else {
                                    // CONSTRUCT WORD
                                    let value = wordString;
                                    let entry = (response.data && response.data.results) ? response.data.results[0] || {} : {};
                                    let defined = !!(response.data && response.data.results && response.data.results.length && response.data.results[0].score > 2 && entry.matchType !== 'fuzzy');
                                    // console.log(`INSERTING WORD: ${wordString}`);
                                    word = { value, defined, entry }

                                    // ADD WORD TO DB
                                    const addRequest = db.collection(collection).insert(word).then(result => {
                                        // console.log(`INSERTED WORD: ${wordString}`);
                                        // console.log(result.ops[0]);
                                        const insertedWord = result.ops[0];
                                        this.cacheWord(insertedWord);
                                        return insertedWord;
                                    });

                                    this.cacheRequest(addRequest, wordString);
                                    return addRequest;
                                    // console.log(word);

                                    // console.log(`FETCHED WORD: ${wordString} - ${word.defined}`);
                                    // this.cacheWord(word);
                                    // return word;
                                }
                            }).catch(err => {
                                // console.log(`ERROR`);
                                // console.log(err.response.data);
                                // CHECK IF THE WORD HAS BEEN FOUND
                                var word = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
                                if (word) {
                                    // console.log(`FOUND WORD AFTER ERROR: ${wordString} - ${word.defined}`);
                                    return word;
                                }
                                else {
                                    // console.log(`COULD NOT FIND WORD AFTER ERROR ${wordString}`)
                                    let value = wordString.toUpperCase();
                                    let defined = false;
                                    let entry = err.response.data;
                                    word = { value, defined, entry }
                                    this.cacheWord(word);
                                    return word;
                                }
                            });
                        }
                        this.cacheRequest(request, wordString);
                        return request;
                    });
                    return word;
                }
                this.cacheRequest(request, wordString);
                return request;
            }
        });
        return Promise.all(validations).then(vals => {
            console.log(`PROMISE RESOLVED`);
            // console.log(vals);
            // console.log(cache);
            return vals;
        }).catch(err => {
            console.log(`PROMISE ERROR`);
            // console.log(err);
        })
    }
}

// ENDPOINTS
app.get('/api/cache', (req, res) => {
    res.status(200).send(cache.words);
});
app.post('/api/validate', (req, res) => {
    let { words } = req.body;
    cache.validate(words).then(results => {
        res.status(200).send(results);
        // console.log(JSON.stringify(cache, null, 4));
    }).catch(err => {
        res.status(500).send(err);
        // console.log(JSON.stringify(cache, null, 4));
    });
});

const path = require('path');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
