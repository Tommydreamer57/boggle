
// axios.get(`${OXFORD_URL}/wordlist/en/word_length=>5,<7`, config).then(response => {
//     console.log(response.data);
// })

// PEARSON
// axios.get('http://api.pearson.com/v2/ldoce5/entries').then(response => {
//     console.log(JSON.stringify(response.data, null, 4));
// }).catch(err => {
//     console.log(err.response);
// });

// const text = 'ONE TWO THREE FORRRR'

// BING
// const config = {
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Content-Length': text.length + 5,
//         'Ocp-Apim-Subscription-Key': BING_API_KEY_ONE
//     }
// }
// axios.get(`${BING_URL}?mkt=en-US&mode=proof&text=${text}`, config).then(response => {
//     console.log(response.data);
// }).catch(err => {
//     console.log(err.response.data);
// });


    // OXFORD
    // const validations = [];
    // words.forEach(word => {
    //     const url = `${OXFORD_URL}/entries/en/${word.toLowerCase()}`;
    //     axios.get(url, config).then(response => {
    //         if (response.data) validations.push(response.data.results[0]);
    //     }).catch(err => {
    //         console.log(err)
    //         validations.push({ id: word.toLowerCase(), failed: true });
    //     });
    // });
    // function check(intervals) {
    //     if (!intervals || validations.length === words.length) {
    //         res.status(200).send(validations);
    //     } else {
    //         setTimeout(check.bind(null, intervals - 1), 500);
    //     }
    // }
    // check(100);
    // BING
    // // const text = words.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(". ") + ".";
    // // const text = words.join(" ").toLowerCase() + '.';
    // const prefix = "I really like "
    // const suffix = "."
    // // const text = [prefix + words[0], ...words.slice(1)].join(`${suffix} ${prefix}`) + suffix;
    // const text = prefix + words[0] + suffix;
    // const config = {
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': text.length + 5,
    //         'Ocp-Apim-Subscription-Key': BING_API_KEY_ONE
    //     }
    // }
    // console.log(text);
    // axios.get(`${BING_URL}&text=${text}`, config).then(response => {
    //     console.log(response.data);
    //     res.status(200).send(response.data);
    // }).catch(err => {
    //     console.log(err.response.data);
    //     res.status(200).send(err);
    // });


// URI=mongodb+srv://Tommydreamer57:atomlao99@tommydreamer57-pjw98.mongodb.net/test
// DBNAME=Tommydreamer57

// CLOUD_KEY=665776219848248
// CLOUD_SECRET=8DYB4Pi7NlTa94ezpF4HymTADdE
// CLOUD_ENV=cloudinary://665776219848248:8DYB4Pi7NlTa94ezpF4HymTADdE@tommydreamer57/

// SECRET=svnkdfjerghuijwofkslcdnvjferghuiwjfakmskldowefjihruvnjdsk

// AUTH_DOMAIN=tommydreamer57.auth0.com
// AUTH_CLIENT_ID=R5NNVySVAW1BaxabH9b4dtZCXItgtajf
// AUTH_CLIENT_SECRET=AJRQleUABEePIz4Pmb-MpRPiAhmPpZJW4L03wgLMGujYuYVjR27uOwtP3XAXGBi8

// CALLBACK_URL=http://localhost:8070/auth/callback

// SUCCESS_REDIRECT=http://localhost:8080/#/dashboard
// FAILURE_REDIRECT=http://localhost:8080/#/


// const MongoClient = require('mongodb').MongoClient;

// // MONGODB CONNECTION

// // CONNECTION
// MongoClient.connect(URI, function (err, client) {
//     const db = client.db(DBNAME);
//     app.set('db', db);
//     // console.log(db.listCollections({}));
//     console.log(`${DBNAME} connected to server`);
//     app.listen(PORT, () => console.log(`Resume Review listening on port ${PORT}`));
// });




// CACHE
/*
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
        console.log(words);
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
                    const query = { value: wordString }
                    const word = db.collection(collection).count(query).then(count => {
                        // console.log(count);
                        if (count) {
                            console.log(`FOUND DB WORD: ${wordString}`);
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
        });
    }
}
*/

