const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const {
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
    cacheRequest(promise, word) {
        if (this.currentRequests.includes(promise)) return;
        const id = this.currentRequestId++;
        const value = word.toUpperCase();
        const request = {
            id,
            value,
            promise
        }
        const removeCachedRequest = (response) => {
            this.currentRequests.splice(this.currentRequests.indexOf(request), 1);
            return response;
        }
        promise.then(removeCachedRequest);
        this.currentRequests.push(request);
    },
    validate(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        console.log(words);
        const validations = words.map(wordString => {
            const word = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
            if (word) {
                console.log(`FOUND WORD: ${wordString} - ${word.defined}`)
                return word;
            }
            else {
                console.log(`FETCHING WORD: ${wordString}`)
                const url = `${OXFORD_URL}/entries/en/${wordString.toLowerCase()}`;

                // CHECK CACHE FOR CURRENT REQUESTS
                let request = this.currentRequests.find(request => request.value.toUpperCase() === wordString.toUpperCase());

                if (request) request = request.promise;

                if (!request) request = axios.get(url, config).then(response => {
                    // CHECK IF THE WORD HAS BEEN FOUND
                    var word = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
                    if (word) {
                        console.log(`FOUND WORD: ${wordString} - ${word.defined}`)
                        return word;
                    }
                    else {
                        word = {
                            value: wordString,
                            defined: !!(response.data && response.data.results),
                        }
                        console.log(`FETCHED WORD: ${wordString} - ${word.defined}`);
                        this.words.push(word);
                        return word;
                    }
                }).catch(err => {
                    // CHECK IF THE WORD HAS BEEN FOUND
                    var word = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
                    if (word) {
                        console.log(`FOUND WORD: ${wordString} - ${word.defined}`);
                    }
                    else {
                        word = {
                            value: wordString.toUpperCase(),
                            defined: false,
                        }
                        console.log(`FETCHED WORD: ${wordString} - ${word.defined}`);
                        this.words.push(word);
                    }
                    return word;
                });
                this.cacheRequest(request, wordString);
                return request;
            }
        });
        return Promise.all(validations);
    }
}

app.post('/api/validate', (req, res) => {
    const { words } = req.body;
    cache.validate(words).then(results => {
        res.status(200).send(results);
        console.log(cache);
    }).catch(err => {
        res.status(500).send(err);
        console.log(cache);
    });
});

const path = require('path');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));
