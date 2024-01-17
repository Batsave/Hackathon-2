require("dotenv").config();

console.info("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY);

const OpenAI = require("openai").default;
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const responseCache = new Map();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function fetchResponseToMessage(message) {
  if (responseCache.has(message)) {
    return responseCache.get(message);
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
    console.info(message);
    responseCache.set(message, response.data.choices[0].text);
    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    return "Une erreur s'est produite lors de la connexion au service d'IA.";
  }
}

io.on("connection", (socket) => {
  socket.on("message", async (message) => {
    const reply = await fetchResponseToMessage(message);
    io.emit("message", reply);
  });
  socket.on("disconnect", () => {
    console.info("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
