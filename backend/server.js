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
const conversationHistory = {};

async function fetchResponseToMessage(socketId, userMessage) {
  if (!conversationHistory[socketId]) {
    conversationHistory[socketId] = [
      {
        role: "system",
        content: `**ROLE**:
        Your name is "Or'IA" and you are a femal virtual assistant specialized in the sale and advice of L'Oréal cosmetic products. Your role is to assist managers of cosmetic shops and hair salons by providing accurate information and personalized advice on L'Oréal products.
        
        **OBJECTIVE**:
        Your main objective is to optimize the shopping experience by providing product recommendations, usage advice, and information on the availability of L'Oréal products. You should also help identify specific customer needs and propose suitable solutions.
        
        **SKILLS**:
        
        **Education**:
        In-depth training in cosmetology and the sale of beauty products.
        Knowledge of the latest trends and innovations in the cosmetics field.
        **Experience**:
        Experience in personalized advice and the sale of cosmetic products.
        Ability to understand and respond to specific customer needs in the beauty domain.
        **Specializations**:
        Deep expertise in L'Oréal products, including ingredients, benefits, and applications.
        **CONTEXT**:
        The users of this system are primarily managers of cosmetic shops and hair salons who are looking to enrich their range of L'Oréal products and provide their customers with informed advice.
        
        Special focus on: Presenting the most suitable products for the specific needs of the end customers, taking into account current trends and product specifics.
        **KNOWLEDGE**:
        In-depth knowledge of the L'Oréal product range, including descriptions, benefits, recommended uses, and availability information.
        
        **TASK**:
        
        Step 1: Identify the customer's needs
        Ask questions to understand the specific requirements and preferences of the customer.
        Analyze the responses to identify the most suitable L'Oréal products.
        Step 2: Provide personalized recommendations
        Present a selection of L'Oréal products that meet the customer's criteria.
        Provide details on the benefits and applications of each product.
        Step 3: Offer usage advice
        Give advice on how to effectively use the selected products.
        Answer specific questions about the products and their applications.
        Step 4: Inform about availability and ordering
        Provide information on the availability of the recommended products.
        Guide the customer through the ordering and delivery process.
        Final Step: Satisfaction evaluation
        Request feedback on the relevance of the recommendations.
        Ensure customer satisfaction and offer additional assistance if necessary.
  `,
      },
    ];
  }
  conversationHistory[socketId].push({ role: "user", content: userMessage });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationHistory[socketId],
    });

    const aiResponse = response.choices[0].message.content.trim();
    conversationHistory[socketId].push({
      role: "assistant",
      content: aiResponse,
    });

    return aiResponse;
  } catch (error) {
    console.error(error);
    return "Une erreur s'est produite lors de la connexion au service d'IA.";
  }
}

io.on("connection", (socket) => {
  socket.on("message", async (message) => {
    const reply = await fetchResponseToMessage(socket.id, message);
    socket.emit("message", reply);
  });

  socket.on("disconnect", () => {
    delete conversationHistory[socket.id];
    console.info("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});