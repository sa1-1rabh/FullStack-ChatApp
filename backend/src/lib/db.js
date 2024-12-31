const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongodb url-", process.env.MONGODB_URL);
    console.log("DataBase Connected - ", conn.connection.host);
  } catch (err) {
    console.log("Can't Connect DB!", err);
  }
};

module.exports = connectMongoDB;
