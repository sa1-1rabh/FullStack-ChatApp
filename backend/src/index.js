const express = require("express");
const dotenv = require("dotenv");
const connectMongoDB = require("./lib/db.js");
const authRoute = require("./routes/auth.routes.js");
const messageRoute = require("./routes/message.routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { server, app } = require("./lib/socket.js");
const path = require("path");

dotenv.config();
// const __dirname = path.resolve();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [
      "https://fullstack-chatapp-2vqm.onrender.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

// app.get("/", (req, res) => {
//   return res.json({ "msg:": "Server Working!" });
// });

server.listen(PORT, () => {
  console.log("Server Started at ", PORT);
  connectMongoDB();
});
