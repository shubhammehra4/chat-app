const express = require("express"),
    router = express.Router();
const {
    registerRequest,
    registerConfirm,
    signin,
} = require("../handlers/auth");

router.post("/register", registerRequest);
router.post("/activate", registerConfirm);
router.post("/signin", signin);

module.exports = router;
