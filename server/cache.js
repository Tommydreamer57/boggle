const axios = require('axios');

class Cache {
    constructor(config) {
        this.dbCollection = config.dbCollection;
        this.config = config.config;
        this.env = config.env;
        this.words = [
            {
                value: "CACHE",
                defined: true
            }
        ];
        this.currentRequestId = -1
        this.currentRequests = [
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
        // console.log(`RESPONSE ${request.value}`);
        // console.log(response && response.data && response.data[0]);
        // console.log(`CURRENT REQUESTS`);
        // console.log(this.currentRequests);
        this.currentRequests.splice(this.currentRequests.indexOf(request), 1);
        return response;
    }
    cacheRequest(promise, string) {
        // console.log(`CACHING REQUEST`)
        // console.log(` - - `, type, string);
        if (this.currentRequests.some(request => request.promise === promise)) return promise;
        if (typeof string === 'object') string = string.value;
        const id = ++this.currentRequestId;
        const value = string.toUpperCase();
        const subscribers = 1;
        const request = {
            id,
            // type,
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
        if (this.words.find(cachedWord => cachedWord.value.toUpperCase() === value.toUpperCase() && cachedWord.defined === defined)) return;
        // ONLY ADD VALUE AND DEFINED PROPERTIES
        this.words.push({ value, defined });
        return word;
    }
    find(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        return words.map(this.findOne);
    }
    findOne(wordString) {
        return this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
    }
    findInDb(wordString) {
        // console.log(`FINDING IN DB - ${wordString}`);
        const query = { value: wordString };
        const request = this.dbCollection.find(query).next().then(this.cacheWord.bind(this));
        // return this.cacheRequest(request, wordString);
        return request;
    }
    getFromOxford(wordString) {
        // console.log(`FETCHING FROM OXFORD - ${wordString}`);
        const url = `${this.env.OXFORD_URL}/search/en?q=${wordString.toLowerCase()}`;
        const request = axios.get(url, this.config);
        // return this.cacheRequest(request, wordString);
        return request;
    }
    insertInDb(wordString, data) {
        // console.log(`INSERTING INTO DB - ${wordString}`);
        let value = wordString;
        let entry = (data && data.results) ? data.results[0] || {} : {};
        let defined = !!(data && data.results && data.results.length && data.results[0].score > 2 && entry.matchType !== 'fuzzy');
        const word = { value, defined, entry };
        const request = this.dbCollection.insert(word).then(result => {
            const insertedWord = result.ops[0];
            return this.cacheWord(insertedWord);
        });
        // return this.cacheRequest(request, wordString);
        return request;
    }
    validate(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        // console.log(`WORDS`)
        // console.log(words);
        return Promise.all(words.map(wordString => {
            wordString = wordString.toUpperCase();
            // CHECK CACHE FOR WORD
            const cachedWord = this.findOne(wordString);
            if (cachedWord) return cachedWord;
            // CHECK CACHE FOR CURRENT REQUESTS
            return this.findRequest(wordString).then(word => {
                if (word) {
                    // console.log(`SUBSCRIBED REQUEST RESOLVED - ${wordString}`);
                    // console.log(word);
                    return word;
                }
                // CHECK DB FOR WORD
                const request = this.findInDb(wordString).then(word => {
                    // console.log(`FOUND IN DB ${wordString}`);
                    // console.log(word);
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
