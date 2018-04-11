const axios = require('axios');

class Cache {
    constructor(config) {
        this.db = config.db;
        this.collection = config.collection;
        this.config = config.config;
        this.env = config.env;
        this.words = [
            {
                value: "CACHE",
                defined: true
            }
        ]
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
        ]
    }
    cacheRequest(promise, string) {
        console.log(`CACHING REQUEST`);
        console.log(promise, string);
        if (this.currentRequests.includes(promise)) return;
        // console.log(promise);
        // console.log(this.currentRequests);
        if (typeof string === 'object') string = string.value;
        const id = this.currentRequestId++;
        const value = string.toUpperCase();
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
        console.log(this);
    }
    findRequest(wordString) {
        return this.currentRequests.find(request => request.value.toUpperCase() === wordString.toUpperCase());
    }
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
    }
    find(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        return words.map(this.findOne);
    }
    findOne(wordString) {
        return this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
    }
    countInDb(wordString) {
        const query = { value: wordString };
        return this.db.collection(this.collection).count(query);
    }
    findInDb(wordString) {
        const query = { value: wordString };
        const cursor = this.db.collection(this.collection).find(query);
        const word = cursor.next().then(word => {
            this.cacheWord(word);
            return word;
        });
        return word;
    }
    getFromOxford(wordString) {
        const url = `${this.env.OXFORD_URL}/search/en?q=${wordString.toLowerCase()}`;
        return axios.get(url, this.config);
    }
    insertInDb(wordString, data) {
        let value = wordString;
        let entry = (data && data.results) ? data.results[0] || {} : {};
        let defined = !!(data && data.results && data.results.length && data.results[0].score > 2 && entry.matchType !== 'fuzzy');
        // console.log(`INSERTING WORD: ${wordString}`);
        const word = { value, defined, entry };
        return this.db.collection(this.collection).insert(word).then(result => {
            // console.log(`INSERTED WORD: ${wordString}`);
            // console.log(result.ops[0]);
            const insertedWord = result.ops[0];
            this.cacheWord(insertedWord);
            return insertedWord;
        });
    }
    validate(...words) {
        if (words.length === 1 && Array.isArray(words[0])) words = words[0];
        console.log(words);
        const validations = words.map(wordString => {
            wordString = wordString.toUpperCase();
            // CHECK CACHE FOR WORD
            // const cachedWord = this.words.find(word => word.value.toUpperCase() === wordString.toUpperCase());
            const cachedWord = this.findOne(wordString);
            if (cachedWord) {
                // console.log(`FOUND CACHED WORD: ${wordString} - ${cachedWord.defined}`);
                return cachedWord;
            }
            else {
                // CHECK CACHE FOR CURRENT REQUESTS
                let request = this.findRequest(wordString);
                if (request) {
                    // console.log(`AWAITING WORD: ${wordString}`);
                    return request.promise;
                }
                else {
                    // CHECK DB FOR WORD
                    const query = { value: wordString }
                    return this.countInDb(wordString).then(count => {
                        // console.log(count);
                        if (count) {
                            console.log(`FOUND DB WORD: ${wordString}`);
                            return this.findInDb(wordString);
                        }
                        else {
                            // FETCH WORD FROM OXFORD
                            return this.getFromOxford(wordString).then(response => {
                                return this.insertInDb(wordString, response.data);
                            });
                        }
                    });
                }
            }
        });
        return Promise.all(validations).then(vals => {
            console.log(`PROMISE RESOLVED`);
            // console.log(vals);
            console.log(this);
            return vals;
        }).catch(err => {
            console.log(`PROMISE ERROR`);
            console.log(err);
        })
    }
}

module.exports = Cache;
