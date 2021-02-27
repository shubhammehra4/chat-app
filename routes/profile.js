const express = require("express"),
    router = express.Router({
        mergeParams: true,
    });
const multer = require("multer"),
    { storage } = require("../middlewares/cloudinary"),
    upload = multer({ storage });

router.put("/profile", upload.single("picture"));

module.exports = router;
