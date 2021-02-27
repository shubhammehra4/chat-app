const mongoose = require("mongoose"),
    bcrypt = require("bcrypt"),
    Schema = mongoose.Schema;

const profilePictureSchema = new Schema({
    url: String,
    filename: String,
});

profilePictureSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_100");
});

const geoSchema = new Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
});

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        // validate: [(val) => {}, "Email is not valid"],
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        minlength: [3, "Please enter a Valid name"],
        maxlength: [30, "Name is too long"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password is too short"],
    },
    picture: profilePictureSchema,
    status: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "unspecified"],
    },
    dob: Date,
    address: String,
    geometry: geoSchema,
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 13);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return next(err);
    }
};

userSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        console.log("Do Cleanup for this user");
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
