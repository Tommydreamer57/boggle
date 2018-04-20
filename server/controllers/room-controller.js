module.exports = {
    joinRoom({ room }) {
        const { socket } = this;
        if (socket.room) socket.leave(socket.room);
        socket.join(room);
    },
    leaveRoom({ room }) {
        const { socket } = this;
        socket.leave(room);
    }
}