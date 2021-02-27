const express = require("express"),
    router = express.Router();

const multer = require("multer"),
    { storage } = require("../middlewares/cloudinary"),
    upload = multer({ storage });

const {
    createRoom,
    postMessages,
    getMessages,
    editRoom,
} = require("../handlers/room");

router.post("/:name", createRoom);

router.put("/:name", editRoom);

router.post("/:name/messages", postMessages);

router.get("/:name/messages", getMessages);

module.exports = router;
