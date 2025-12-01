"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 8080;
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
let count = 0;
app.use((0, cors_1.default)());
wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.action === "increment") {
                count++;
            }
            else if (data.action === "decrement") {
                count--;
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify({ type: "update", value: count }));
            }
        });
    });
    ws.on('close', () => {
        console.log('client disconnected');
    });
});
server.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
