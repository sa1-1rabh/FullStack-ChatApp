const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");

async function isLoggedIn(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ msg: "Not Logged In" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ msg: "Invalid Token" });
    }

    const user = await userModel
      .findById(decoded.userId)
      .select("-hashPassword"); //SELECT EVERYTHING EXCEPT PASSWORD

    if (!user) {
      return res.status(400).json({ msg: "User not found " });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ msg: `${err}` });
  }
}

module.exports = isLoggedIn;
