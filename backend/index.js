import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { generateResponse } from "./src/service/ai.service.js";
import { text } from "stream/consumers";

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173", //frontend server
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
 

//io:-whole server
//socket:-single user/client

const chatHistory = [];

// Built-in events
io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });

    // Custom event
    socket.on("ai-message", async (data) => {
        console.log("AI MESSAGE RECEIVED:", data);
        chatHistory.push({ role: "user", parts:[{text: data}] });

        // Emit the response back to the client  
        const response = await generateResponse(chatHistory);

        socket.emit("ai-message-response", response );
    });
});


// Start server (outside the io.on block)
httpServer.listen(3000, () => {
    console.log("listening on *:3000"); 
});
