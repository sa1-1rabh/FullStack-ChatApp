var bcrypt = require("bcryptjs");
const userModel = require("../models/user.models");
const { createToken } = require("../lib/utils.lib");
const cloudinary = require("../lib/cloudinary.js");

async function handleSignUp(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Fill All Fields!" });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password Length Less Than 6!" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User Already Exists!" });
    }
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new userModel({ name, email, hashPassword });

    if (newUser) {
      createToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ msg: "Invalid User Data" });
    }
  } catch (err) {
    return res.status(400).json({ "error in signup -": err });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Fill All Fields!" });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "No User Found!" });
    }
    const comp = bcrypt.compareSync(password, user.hashPassword);
    if (!comp) {
      return res.status(400).json({ msg: "Invalid Credentials!" });
    }

    createToken(user._id, res);
    return res.status(200).json({ msg: "Successfull Login!" });
  } catch (err) {
    return res.json({ "error in login-": `${err}` });
  }
}

async function handleLogout(req, res) {
  try {
    // res.clearCookie("token");
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ msg: "Logout Successful!" });
  } catch (err) {
    return res.json({ "error in logout-": `${err}` });
  }
}

async function handleUpdateProfile(req, res) {
  try {
    const { profilePic } = req.body;
    const user = req.user;
    if (!profilePic) {
      return res.status(400).json({ msg: "No Pic Found!" });
    }
    const uploadResult = await cloudinary.uploader
      .upload(profilePic)
      .catch((error) => {
        console.log("cloudinary error-" + error);
      });

    const updatedUser = await userModel.findOneAndUpdate(
      user._id,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(400).json({ msg: `Error in Update Profile - ${err}` });
  }
}

function checkAuth(req, res) {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(400).json({ msg: "error in authentication!" });
  }
}

module.exports = {
  handleLogin,
  handleSignUp,
  handleLogout,
  handleUpdateProfile,
  checkAuth,
};
