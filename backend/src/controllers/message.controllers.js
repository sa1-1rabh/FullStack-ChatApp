const { getReceiverSocketId } = require("../lib/socket");
const messageModel = require("../models/message.models");
const userModel = require("../models/user.models");
const { io } = require("../lib/socket");
const cloudinary = require("../lib/cloudinary");

async function handleGetUsers(req, res) {
  try {
    const currUserId = req.user._id;
    const allUsersExceptUs = await userModel
      .find({ _id: { $ne: currUserId } })
      .select("-hashPassword");
    return res.status(200).json(allUsersExceptUs);
  } catch (err) {
    return res.status(400).json({ msg: "cant fetch users - " + err });
  }
}

async function handleGetMessages(req, res) {
  try {
    const { id: toSendId } = req.params;
    const currUserId = req.user._id;

    const allMessages = await messageModel.find({
      $or: [
        { senderId: currUserId, receiverId: toSendId },
        { senderId: toSendId, receiverId: currUserId },
      ],
    });

    return res.status(200).json(allMessages);
  } catch (err) {
    return res.status(400).json({ msg: "cant fetch messages - " + err });
  }
}

async function handleSendMessage(req, res) {
  try {
    const { text, image } = req.body;
    // console.log("image-", image);
    const currUserId = req.user._id;
    const { id: toSendId } = req.params;

    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      // console.log("uploadResponse-", uploadResponse);
      imageURL = uploadResponse.secure_url;
      // console.log("imageURL-", imageURL);
    }

    const newMessage = await messageModel.create({
      senderId: currUserId,
      receiverId: toSendId,
      image: imageURL,
      text: text,
    });

    const receiverSocketId = getReceiverSocketId(toSendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (err) {
    return res.status(400).json({ msg: "Can't Send Message - " + err });
  }
}

module.exports = { handleGetUsers, handleGetMessages, handleSendMessage };
