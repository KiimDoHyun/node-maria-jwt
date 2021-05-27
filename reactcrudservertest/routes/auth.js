// 서버 개발을 위한 경량화된 프레임워크
const express = require("express");
const router = express.Router();
const {login,test} = require("../controllers/auth");

router.post("/login", login);
router.get("/test", test);
router.get("/", (req, res) => res.send("Develog!"));
module.exports = router;