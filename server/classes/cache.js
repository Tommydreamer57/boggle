const axios = require('axios');
const dump = require('../dump/words.json');

const dictionary = dump.reduce((obj, word) => {
    obj[word.value.toUpperCase()] = word.defined;
    return obj;
}, {})

class Cache {
    constructor({ dbCollection, config, env }) {
        // DATABASE
        this.dbCollection = dbCollection;
        // CONFIG
        this.config = config;
        // ENV
        this.env = env;
        // DICTIONARY
        this.dictionary = dictionary;
        // REQUEST ID
        this.currentRequestId = -1;
        // CURRENT REQUESTS
        this.currentRequests = [
            // EXAMPLE REQUEST
            {
                id: -1,
                value: "WORD",
                promise: new Promise(resolve => {
                    setTimeout(() => {
                        this.currentRequests.splice(0, 1);
                        resolve();
                    }, 0);
                })
            }
        ];
    }
    removeCachedRequest(request, response) {
        this.currentRequests.splice(this.currentRequests.indexOf(request), 1);
        return response;
    }
    cacheRequest(promise, string) {
        if (this.currentRequests.some(request => request.promise === promise)) return promise;
        if (typeof string === 'object') string = string.value;
        const id = ++this.currentRequestId;
        const value = string.toUpperCase();
        const subscribers = 1;
        const request = {
            id,
            value,
            subscribers,
            promise
        }
        this.currentRequests.push(request);
        return promise.then(this.removeCachedRequest.bind(this, request));
    }
    findRequest(wordString) {
        const request = this.currentRequests.reverse().find(request => request.value.toUpperCase() === wordString.toUpperCase());
        if (request) {
            request.subscribers++;
            return request.promise;
        }
        else return { then: cb => cb() };
    }
    cacheWord(word) {
        if (!word) return;
        const { value, defined } = word;
        // CHECK IF ALREADY CACHED
        if (!this.dictionary.hasOwnProperty(value.toUpperCase())) {
            this.dictionary[value.toUpperCase()] = defined;
            return word;
        }
    }
    find(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        return words.map(this.findOne);
    }
    findOne(wordString) {
        let result = this.dictionary[wordString.toUpperCase()];
        if (result !== undefined) {
            return {
                value: wordString.toUpperCase(),
                defined: result
            };
        }
    }
    findInDb(wordString) {
        const query = { value: wordString };
        return this.dbCollection.find(query).next().then(this.cacheWord.bind(this));
    }
    getFromOxford(wordString) {
        const url = `${this.env.OXFORD_URL}/search/en?q=${wordString.toLowerCase()}`;
        return axios.get(url, this.config);
    }
    insertInDb(wordString, data) {
        let value = wordString;
        let entry = (data && data.results) ? data.results[0] || {} : {};
        let defined = !!(data && data.results && data.results.length && data.results[0].score > 2 && entry.matchType !== 'fuzzy');
        const word = { value, defined, entry };
        return this.dbCollection.insert(word).then(result => {
            const insertedWord = result.ops[0];
            return this.cacheWord(insertedWord);
        });
    }
    validate(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        return Promise.all(words.map(wordString => {
            wordString = wordString.toUpperCase();
            // CHECK CACHE FOR WORD
            const cachedWord = this.findOne(wordString);
            if (cachedWord) return cachedWord;
            // CHECK CACHE FOR CURRENT REQUESTS
            return this.findRequest(wordString).then(word => {
                if (word) return word;
                // CHECK DB FOR WORD
                const request = this.findInDb(wordString).then(word => {
                    if (word) return word;
                    // CHECK OXFORD FOR WORD
                    return this.getFromOxford(wordString).then(response => {
                        return this.insertInDb(wordString, response.data);
                    });
                });
                return this.cacheRequest(request, wordString);
            });
        }));
    }
}

module.exports = Cache;
