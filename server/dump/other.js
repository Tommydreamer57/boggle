
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

