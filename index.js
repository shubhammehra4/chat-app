if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"),
    cors = require("cors"),
    helmet = require("helmet"),
    mongoSanitize = require("express-mongo-sanitize"),
    errorHandler = require("./utils/Error");

const app = express();
const http = require("http").Server(app);
//! Security
app.use(helmet());
app.use(cors());
app.use(mongoSanitize({ replaceWith: "_" }));
//! Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//! Dev
if (process.env.NODE_ENV !== "production") {
    const morgan = require("morgan");
    app.use(morgan("tiny"));
}

//! Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const {
    loginRequired,
    ensureCorrectUser,
} = require("./middlewares/authorization");

app.use("/api/auth", authRoutes);

app.use("/api/user/:id", ensureCorrectUser, profileRoutes);

app.use("/api/:id/room", loginRequired);

//! Errors
app.use(function (req, res, next) {
    let err = new Error("Not Found!");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

//* Port
http.listen(process.env.PORT, function () {
    console.log(
        `Running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} ENV`
    );
});
