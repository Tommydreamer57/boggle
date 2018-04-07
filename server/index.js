const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const {
    OXFORD_APP_ID,
    OXFORD_APP_KEY,
    OXFORD_URL
} = process.env

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../build`));

const PORT = 3013;
const config = {
    headers: {
        APP_ID: OXFORD_APP_ID,
        APP_KEY: OXFORD_APP_KEY
    }
};

// axios.get(`${OXFORD_URL}/wordlist/en/word_length=>5,<7`, config).then(response => {
//     console.log(response.data);
// })

app.post('/api/validate', (req, res) => {
    const { words } = req.body;
    console.log(words)
    const validations = [];
    words.forEach(word => {
        const url = `${OXFORD_URL}/entries/en/${word.toLowerCase()}`;
        axios.get(url, config).then(response => {
            if (response.data) validations.push(response.data.results[0]);
        }).catch(err => {
            console.log(err)
            validations.push({ id: word.toLowerCase(), failed: true });
        });
    });
    function check(intervals) {
        if (!intervals || validations.length === words.length) {
            res.status(200).send(validations);
        } else {
            setTimeout(check.bind(null, intervals - 1), 500);
        }
    }
    check(100);
});

const path = require('path');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));
