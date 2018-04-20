
class Game {
    static createUser(config) {
        const user = Object.assign({}, config);
        if (!user.words) user.words = [];
        if (!user.points) user.points = 0;
        if (!user.winner) user.winner = false;
        return user
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
