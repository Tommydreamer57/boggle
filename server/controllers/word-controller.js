module.exports = {
    getAllWords(req, res) {
        const ow = req.app.get('ow');
        ow.find().toArray().then(words => {
            console.log(words);
            res.status(200).send(words);
        }).catch(err => {
            console.log(err);
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
        const { dictionary } = req.app.get('cache');
        console.log(dictionary);
        const words = Object.keys(dictionary).map(value => ({
            value,
            defined: dictionary[value]
        }));
        console.log(words);
        res.status(200).send(words);
    },
    validateOne(req, res) {
        const cache = req.app.get('cache');
        let word = req.params.word;
        cache.validate(word).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            console.log("VALIDATE ON ERROR");
            console.log(err);
            res.status(500).send(err);
        });
    },
    validateMany(req, res) {
        const cache = req.app.get('cache');
        let { words } = req.body;
        cache.validate(words).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            console.log("VALIDATE MANY ERROR");
            console.log(err);
            res.status(500).send(err);
        });
    }
}