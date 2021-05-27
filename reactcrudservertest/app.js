const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes");

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.urlencoded({extended: true}));

router(app);

module.exports = app;