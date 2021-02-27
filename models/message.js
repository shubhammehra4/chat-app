const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("preview").get(function () {
    return this.url.replace("/upload", "/upload/w_300");
});

const messageSchema = new Schema(
    {
        message: {
            type: String,
            trim: true,
            maxlength: [200, "Message is too long"],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        images: [ImageSchema],
        createdAt: { type: Date, default: Date.now() },
    },
    {
        toJSON: { virtuals: true },
    }
);
//! Post Delete Cleanup

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
