const db = require("../models"),
    jwt = require("jsonwebtoken");

const { activation } = require("../utils/mailer");

exports.registerRequest = async (req, res, next) => {
    try {
        let { name, email, password } = req.body;
        let user = await db.User.findOne({ email });
        if (user) {
            return next({
                status: 400,
                message: "Email is already Registered!",
            });
        }

        let token = jwt.sign(
            { name, email, password },
            process.env.JWT_ACTIVATE_TOKEN_SECRET,
            { expiresIn: "20m" }
        );
        const response = await activation(token, email);
        if (!response.error) {
            return res.status(200).json({
                message: "Pending Confirmation",
            });
        }
        return next({ message: "The email couldn't be sent!" });
    } catch (err) {
        return next({
            status: 400,
            message: err.message || err,
        });
    }
};

exports.registerConfirm = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (token) {
            await jwt.verify(
                token,
                process.env.JWT_ACTIVATE_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) {
                        return next({ message: "Incorrect or Expired Link!" });
                    }
                    try {
                        let { name, email, password } = decoded;
                        let user = await db.User.create({
                            name,
                            email,
                            password,
                        });
                        let { id } = user;
                        let authToken = jwt.sign(
                            { id, email },
                            process.env.JWT_AUTH_TOKEN_SECRET
                        );

                        return res.status(201).json({
                            id,
                            name,
                            email,
                            token: authToken,
                        });
                    } catch (err) {
                        if (err.code && err.code === 11000) {
                            err.message = "Email Already Registered!";
                        }
                        return next({
                            status: 400,
                            message: err.message || err,
                        });
                    }
                }
            );
        } else {
            return next({
                status: 400,
                message: "No Token Provided",
            });
        }
    } catch (err) {
        return next(err);
    }
};

exports.signin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let user = await db.User.findOne({ email });
        let isMatch = await user.comparePassword(password);
        if (isMatch) {
            let { id, name, email } = user;
            let token = jwt.sign(
                { id, email },
                process.env.JWT_AUTH_TOKEN_SECRET
            );
            return res.status(200).json({
                id,
                name,
                email,
                token,
            });
        }

        return next({
            status: 400,
            message: "Invalid Credentials",
        });
    } catch (err) {
        return next({
            status: 400,
            message: "Invalid Credentials",
        });
    }
};
