const db = require("../models");

exports.createRoom = async (req, res, next) => {
    try {
        let { id, name } = req.params;
        await db.Room.create({
            name,
            author: id,
            admins: [id],
            members: [id, ...req.body.members],
        });
        return res.sendStatus(201);
    } catch (err) {
        next(err);
    }
};

exports.editRoom = async (req, res, next) => {
    try {
        console.log("Editing");
        return res.send("ok");
    } catch (err) {
        return next(err);
    }
};

exports.postMessages = async (req, res, next) => {
    try {
        let { name, id } = req.params;
        let { message } = req.body;
        let message = await db.Message.create({ message, author: id });
        let room = await db.Room.findOne({ name });
        room.messages.push(message._id);
        await room.save();
        return res.sendStatus(201);
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        let { name, id } = req.params;
        let room = await db.Room.findOne({ name });
        if (room && room.members.includes(id)) {
            await room.populate({
                path: "messages",
                populate: {
                    path: "author",
                    select: "name",
                },
                options: {
                    limit: 5,
                    sort: { createdAt: -1 },
                },
            });
            return res.status(200).json({
                name: room.name,
                messages: room.messages,
            });
        }
        return next({
            status: 400,
            message: "Room is not accessible",
        });
    } catch (err) {
        next(err);
    }
};
