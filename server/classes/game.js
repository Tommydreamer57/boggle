
class Game {
    static createUser(config) {
        const user = Object.assign({}, config);
        if (!user.words) user.words = [];
        if (!user.points) user.points = 0;
        if (!user.winner) user.winner = false;
        return user
    }
    static countPoints(word, boardSize = 4) {
        if (!word || !word.length || parseInt(word.length) !== word.length) return 0;
        switch (boardSize) {
            case 3:
            case 4:
                switch (word.length) {
                    case 0:
                    case 1:
                    case 2:
                        return 0;
                    case 3:
                    case 4:
                        return 1;
                    case 5:
                        return 2;
                    case 6:
                        return 3;
                    case 7:
                        return 5
                    default:
                        if (word.length > 7) return 11;
                        else return 0;
                }
            default:
                switch (word.length) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        return 0;
                    case 4:
                        return 1;
                    case 5:
                        return 2;
                    case 6:
                        return 3;
                    case 7:
                    default:
                        if (word.length > 7) return 11;
                        else return 0;
                }
        }
    }
    static compareWords(players, boardSize = 4) {
        let allWords = players.reduce((words, player) => {
            words.push(...player.words);
            return words;
        }, []);
        return players.map(player => {
            let words = player.words.filter(playerWord => {
                // ONLY RETURN WORDS THAT ARE PRESENT ONLY ONCE
                let count = allWords.filter(word => word.toUpperCase() === playerWord.toUpperCase());
                return count === 1;
            });
            let points = words.reduce((points, word) => points + Game.countPoints(word), 0);
            // RETURN THE PLAYER WITH THE UPDATED WORD ARRAY AND POINTS
            return Object.assign({}, player, words, points);
        });
    }
    static findWinner(game) {
        let players = Game.compareWords(game.players, game.board.length)
        let winner = players.reduce((winner, player) => winner.points > player.points ? winner : player);
        return players.map(player => {
            if (player === winner) return Object.assign({}, player, { winner: true });
            else return Object.assign({}, player, { winner: false });
        });
    }
    constructor(game) {
        Object.assign(this, game);
        if (!this.user) throw new Error('game must have an owner / user');
        if (!this.date) this.date = new Date(Date.now());
        if (!this.startTime) this.startTime = null;
        if (!this.duration) this.duration = 3;
        if (!this.endTime) this.endTime = null;
        if (!this.winner) this.winner = null;
        if (!this.maxPlayers) this.maxPlayers = 10;
        this.players = (this.players || [this.user]).map(player => Game.createUser(player));
    }
}

module.exports = Game;
