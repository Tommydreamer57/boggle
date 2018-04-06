const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const {
    OXFORD_APP_ID,
    OXFORD_APP_KEY,
    OXFORD_URL
} = process.env

const PORT = 3013;
const app = express();
app.use(bodyParser.json());

app.get('/api/validate', (req, res) => {
    const { words } = req.body;
    const config = {
        headers: {
            APP_ID: env.OXFORD_APP_ID,
            APP_KEY: env.OXFORD_APP_KEY
        }
    };
    const validations = [];
    words.forEach(word => {
        const url = `${env.OXFORD_URL}/search/en?q=${word.value.toLowerCase()}`;
        axios.get(url, config).then(response => {
            console.log(response.data);
            validations.push(response.data);
        });
    });
    const intervals = 100;
    function check() {
        if (validations.length === words.length) {
            res.status(200).send(validations);
        } else {
            intervals--;
            if (!intervals) clearInterval(id);
        }
    }
    const id = setInterval(check, 500);
});

app.listen(PORT, () => console.log(`Boggle listening on port ${PORT}`));
