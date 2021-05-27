const app = require("./app");
const db = require("./db.js");
const port = 8000;
// const cors = require("cors")

(async function () {
    // app.use(
    //     cors({
    //         origin: true,
    //         credentials: true,
    //     })
    // );
    app.use((req,res,next)=> {
        // 404 error
        res.status(404).send("일치하는 주소가 없습니다.");
    });
    app.use((err,req,res,next)=> {
        console.error(err.stack);
        res.status(500).send("서버 에러")
    });
    app.listen(port, ()=>{
        console.log(`Server is Listening to port : ${port}`);
    })
})();