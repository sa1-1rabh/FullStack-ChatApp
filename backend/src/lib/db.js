const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DataBase Connected - ", conn.connection.host);
  } catch (err) {
    console.log("Can't Connect DB!", err);
  }
};

module.exports = connectMongoDB;
