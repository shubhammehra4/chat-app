const db = require("../models");

exports.profileEdit = async (req, res, next) => {
    try {
        let { id } = req.params;
        let picture = { url: req.file.path, filename: req.file.filename };
        let user = await db.User.findByIdAndUpdate(id, {
            ...req.body,
            picture,
        });

        return res.status(200).send("Done");
    } catch (err) {
        return next(err);
    }
};
