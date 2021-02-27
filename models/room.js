const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: { type: Date, default: Date.now() },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
