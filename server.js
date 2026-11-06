const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({
    dev,
    hostname,
    port,
});

const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: true,
            methods: ["GET", "POST"],
        },
    });

    global.io = io;

    io.on("connection", (socket) => {
        console.log(
            "Socket connected:",
            socket.id
        );

        socket.on("join-order", async ({ orderId, token } = {}) => {
            try {
                if (!orderId || !token) return;

                // Verify customer JWT
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

                // Load existing MongoDB connection and Order model
                const { default: connectDB } =
                    await import("./lib/mongodb.js");

                const { default: Order } =
                    await import("./models/Order.js");

                await connectDB();

                // Customer can join only their own order room
                const order = await Order.findOne({
                    _id: orderId,
                    userId: decoded.userId,
                })
                    .select("_id")
                    .lean();

                if (!order) {
                    console.log("Unauthorized order room request");
                    return;
                }

                socket.join(`order:${orderId}`);

                console.log(
                    `Customer joined order room: ${orderId}`
                );
            } catch (error) {
                console.error(
                    "JOIN ORDER ERROR:",
                    error.message
                );
            }
        });

        socket.on("disconnect", () => {
            console.log(
                "Socket disconnected:",
                socket.id
            );
        });
    });

    httpServer.listen(port, () => {
        console.log(
            `> Smart Restaurant ready at http://${hostname}:${port}`
        );
    });
});