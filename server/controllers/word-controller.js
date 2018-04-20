module.exports = {
    getAllWords(req, res) {
        const ow = req.app.get('ow');
        ow.find().toArray().then(words => {
            res.status(200).send(words);
        }).catch(err => {
            res.status(500).send(err);
        });
    },
    getDuplicates(req, res) {
        const ow = req.app.get('ow');
        ow.find().toArray().then(words => {
            let results = words.filter(word => {
                if (words.filter(item => item === word).length <= 1) return false;
                else return true;
            })
            return res.status(200).send(results);
        });
    },
    getCache(req, res) {
        const cache = req.app.get('cache');
        res.status(200).send(cache.words);
    },
    validateOne(req, res) {
        const cache = req.app.get('cache');
        let word = req.params.word;
        cache.validate(word).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            res.status(500).send(err);
        });
    },
    validateMany(req, res) {
        const cache = req.app.get('cache');
        let { words } = req.body;
        console.log(words);
        cache.validate(words).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            res.status(500).send(err);
        });
    }
}