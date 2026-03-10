const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
    : [];


let io = null;
const connectedUsers = new Map();

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,      // <--- ICI on utilise ton tableau
            methods: ["GET", "POST"],
            credentials: true            // <--- IMPORTANT pour les cookies/session
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connecté:", socket.id);


        // Le client envoie son userId
        socket.on("register", (userId) => {
            // Ajouter socket dans le map
            if (!connectedUsers.has(userId)) connectedUsers.set(userId, []);
            connectedUsers.get(userId).push(socket.id);

            // Ajouter le socket à une room dédiée à cet utilisateur
            socket.join(`user_${userId}`);

            console.log(`✔️ User ${userId} associé à socket ${socket.id} et room user_${userId}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, sockets] of connectedUsers.entries()) {
                const index = sockets.indexOf(socket.id);
                if (index !== -1) {
                    sockets.splice(index, 1);
                    if (sockets.length === 0) connectedUsers.delete(userId);
                    console.log(`❌ User ${userId} déconnecté de socket ${socket.id}`);
                    break;
                }
            }
        });
    });
}

// Envoi ciblé à l’utilisateur via sa room
function sendToUser(userId, event, data) {
    const socketId = connectedUsers.get(userId);

    if (socketId && io) {
        io.to(`user_${userId}`).emit(event, data);
    }
}




module.exports = {
    initSocket,
    sendToUser,
};
