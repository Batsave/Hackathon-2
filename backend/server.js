require("dotenv").config();

console.info("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY);

const OpenAI = require("openai").default;
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

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
  const initialPrompt = `You are an intelligent assistant specialized in recommending L'Oréal beauty products for professionals. Your expertise is geared towards the needs of hair and beauty salons. When a salon manager or employee asks you for advice on L'Oréal products, you offer options tailored to their specific professional needs. A salon manager asks you:`;
  const fullMessage = `${initialPrompt}\nClient : ${message}\nAssistant :`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: fullMessage }],
    });
    console.info("Response from OpenAI:", response);

    if (
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message
    ) {
      return response.choices[0].message.content;
    }

    return "Désolé, je n'ai pas pu obtenir de réponse.";
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
