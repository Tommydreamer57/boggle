const ObjectId = require('mongodb').ObjectId;
const Game = require('../classes/game');

module.exports = {
    createGame({ game, user }) {
        const { app, socket, io } = this;
        console.log('creating game');

        if (!game.user) game.user = user;

        game = new Game(game);

        console.log(game);

        const bg = app.get('bg');
        bg.insert(game).then(result => {
            console.log(result);
            let game = result.ops[0];
            let { _id } = game;

            if (socket.room) socket.leave(socket.room);
            socket.join(_id);
            io.to(_id).emit('game created', { joinedGame: game });

        });

    },
    findGames() {
        const { app, socket, io } = this;
        console.log('finding games');

        const room = 'FIND';
        socket.join(room);

        const bg = app.get('bg');
        bg.find().toArray().then(currentGames => {
            console.log(currentGames);
            io.to(room).emit('games found', { currentGames });

        });

    },
    joinGame({ gameid, user }) {
        const { app, socket, io } = this;
        console.log('joining game');
        console.log(gameid);
        console.log(user);

        socket.join(gameid);

        const bg = app.get('bg');
        bg.find(ObjectId(gameid)).toArray().then(([joinedGame]) => {

            console.log(joinedGame);

            let players = joinedGame.players || [];

            if (players.some(player => player.name === user.name)) {
                user = players.find(player => player.name === user.name);
                return io.to(gameid).emit('already joined', { joinedGame, user });
            }

            players.push(Game.createUser(user));

            bg.findAndModify({ _id: ObjectId(gameid) }, [], { $set: { players } }, { new: true }).then(results => {
                console.log('SUCCESSFULLY UPDATED ' + gameid);
                console.log(results.value);

                let joinedGame = results.value;

                if (socket.room) socket.leave(socket.room);
                socket.join(gameid);
                io.to(gameid).emit('game joined', { joinedGame });

            }).catch(err => {
                console.log(err);
            });

        });
    },
    startGame({ gameid }) {
        const { app, socket, io } = this;
        console.log('starting game');
        console.log(gameid);

        let startTime = Date.now();

        const bg = app.get('bg');
        bg.findAndModify({ _id: ObjectId(gameid) }, [], { $set: { startTime } }, { new: true }).then(results => {
            console.log('SUCCESSFULLY STARTED ' + gameid);
            console.log(results.value);
            console.log(results.value.players);
            let startedGame = results.value;
            io.to(gameid).emit('game started', { startedGame });
        }).catch(err => {
            console.log(err);
        });

    },
    saveWords({ gameid, user, words }) {
        const { app, socket, io } = this;

        console.log(words);
        console.log(user);
        console.log(gameid);

        const bg = app.get('bg');
        bg.findAndModify({ _id: ObjectId(gameid), players: { $elemMatch: { name: user.name } } }, [], { $addToSet: { "players.$.words": { $each: words } } }, { new: true }).then(results => {
            console.log(results);
            console.log(results.value);
            console.log(results.value.players);
            io.to(gameid).emit('words saved', { user, words });
        }).catch(err => {
            console.log(err);
        });
    },
    endGame({ gameid }) {
        const { app, socket, io } = this;
        console.log('ending game');
        const bg = app.get('bg');
        bg.find(ObjectId(gameid)).toArray().then(([game]) => {
            console.log(game);
            let joinedGame = Game.findWinner(game);
            console.log("CALCULATED WINNER");
            console.log(joinedGame);
            io.to(gameid).emit('game over', { joinedGame });
        });
        // bg.findAndModify({ _id: ObjectId(gameid) }, [], { $set: {} });
    }
}