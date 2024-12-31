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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (res, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 8000;
// app.get("/", (req, res) => {
//   return res.json({ "msg:": "Server Working!" });
// });

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

server.listen(PORT, () => {
  console.log("Server Started at ", PORT);
  connectMongoDB();
});
