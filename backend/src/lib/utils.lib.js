var jwt = require("jsonwebtoken");

const createToken = async (userId, res) => {
  var token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  // console.log("token-> " + token);
  res.cookie("token", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attack cross-site scipting attacks
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

module.exports = { createToken };
