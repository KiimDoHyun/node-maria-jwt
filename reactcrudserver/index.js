var express = require("express");
// var bodyParser = require('body-parser');

const cors = require('cors');

var app = express();
app.use(express.json());

app.use(cors());

// DB
var db = require('./db.js');
const jwt = require("jsonwebtoken");
require('dotenv').config();

//로그인
app.post("/logIn",async function (req, res) {
    // res.send("Login success\n");
    console.log(req.body);

    // id
    console.log(req.body.id);

    // pw
    console.log(req.body.pw);

    // id, pw 비교
    await db.query(`SELECT * from user;`, function(error, result){
        // console.log(result);
        // console.log(result[0].id);
        if(error) {
            throw error;
        }
        else {
            if(result[0].id === req.body.id && result[0].pw === req.body.pw) {
                // 외부로 빼내면 발급이 안됨..
                // const userToken = jwt.sign(req.body.id);
                const userToken = jwt.sign({
                    id:req.body.id
                }, process.env.JWT_SECRET, {
                    expiresIn:'8h',
                    issuer: 'KDooooooh'
                });
                res.status(200).send({
                    token: userToken,
                    msg:"success"
                })
            }
            else {
                res.status(401).send({
                    msg:"id,pw 불일치"
                })
            }
        }

    })
    // 디비 아이디 pw 값 비교
    // 성공시 토큰 발급.

});

// 리스트 데이터 가져오기
app.get("/getData",async function (req, res) {
    await db.query(`SELECT * from data;`, function(error, result){
        // console.log(result[0].id);
        console.log("getData를 수행한다.");
        if(error) {
            throw error;
        }
        else {
            res.status(200).send({
                msg:"success",
                arr: result
            })
        }
    })
});

// 리스트 crud

/*
- 토큰에는 사용자의 로그인때 사용한 아이디값이 들어있다.

- req.body.id = 해당 게시글의 고유 정수값

- decoded.id === req.body.writer
토큰에 있는 사용자 아이디와 현재 게시글 작성자의 아이디 값 비교


*/

// 추가
app.post("/addData",async function (req, res) {
    // 토큰 확인
    let decoded;
    try {
        decoded = jwt.verify(req.body.jwt, process.env.JWT_SECRET);
    } catch(err) {
        if(err.message === 'jwt expired') {
            console.log('expired token');
            return res.status(402).send({
                msg:"토큰이 만료되었습니다."
            })
        }
        else if(err.message === 'invalid token') {
            console.log('invalid token');
            console.log(TOKEN_INVALID);
            return res.status(402).send({
                msg:"토큰이 유효하지 않습니다."
            })
        } else  {
            console.log("invalid token");
            return res.status(402).send({
                msg:"토큰이 유효하지 않습니다."
            })
        }
    }

    await db.query(`INSERT into data values(null,'${decoded.id}','${req.body.name}',${req.body.value});`, function(error, result){
        console.log("addData를 수행한다.");
        if(error) {
            res.status(500).send({
                msg:"백엔드 서버 불안정"
            })
            throw error;
        }
        else {
            res.status(200).send({
                msg:"ADD success"
            })
        }
    })
});

// 수정
app.post("/modData",async function (req, res) {
    console.log("들어온 데이터 확인");
    console.log(req.body);
    // 토큰 확인
    let decoded;
    try {
        decoded = jwt.verify(req.body.jwt, process.env.JWT_SECRET);
    } catch(err) {
        if(err.message === 'jwt expired') {
            console.log('expired token');
            return res.status(402).send({
                msg:"토큰이 만료되었습니다."
            })
        }
        else if(err.message === 'invalid token') {
            console.log('invalid token');
            console.log(TOKEN_INVALID);
            return res.status(402).send({
                msg:"토큰이 유효하지 않습니다."
            })
        } else  {
            console.log("invalid token");
            return res.status(402).send({
                msg:"토큰이 유효하지 않습니다."
            })
        }
    }
   
    // 토큰 유효 하면 여기로

    // 토큰에 있는 사용자 id 와 작성자 id가 같으면 수정 진행 
    if(decoded.id === req.body.writer) {
        await db.query(`UPDATE data set name="${req.body.name}", value=${req.body.value} where id=${req.body.id};`, function(error, result){
            console.log("modData를 수행한다.");
            if(error) {
                throw error;
            }
            else {
                res.status(200).send({
                    msg:"MOD success"
                })
            }
        })
    }
    else {
        res.status(403).send({
            msg:"수정은 본인만 가능"
        })
    }
});

// 삭제
app.post("/delData",async function (req, res) {
    console.log(req.body);
    
    // 토큰 확인
    let decoded;
    try {
        decoded = jwt.verify(req.body.jwt, process.env.JWT_SECRET);
        console.log(decoded);
        console.log(decoded.id);
    } catch(err) {
        if(err.message === 'jwt expired') {
            console.log('expired token');
            return res.status(402).send({
                msg:"토큰이 만료되었습니다."
            })
        }
        else if(err.message === 'invalid token') {
            console.log('invalid token');
            console.log(TOKEN_INVALID);
            return res.status(402).send({
                msg:"토큰이 유효하지 않습니다."
            })
        } else  {
            console.log("invalid token");
            return res.status(402).send({
                msg:"토큰이 유효하지 않습니다."
            })
        }
    }
    
    // 토큰 유효 하면 여기로

    // 토큰에 있는 사용자 id 와 작성자 id가 같으면 삭제 진행 
    if(decoded.id === req.body.writer) {
        await db.query(`DELETE from data where id=${req.body.id};`, function(error, result){
            console.log("delData를 수행한다.");
            if(error) {
                throw error;
            }
            else {
                res.status(200).send({
                    msg:"success",
                    arr: result
                })
            }
        })
    }
    else {
        res.status(403).send({
            msg:"삭제는 본인만 가능"
        })
    }
});

app.post("/post", function (req, res) {
    res.send("Post methods success\n");
    console.log(req.body);

    // id
    console.log(req.body.id);

    // pw
    console.log(req.body.pw);
    // console.log("\n\n--------------------------------\n\n");
    // console.log(req);
    // runTestPose();
});

//겟
app.get("/get", function (req, res) {
    res.send("Get methods success\n");
});

//400에러
// app.use(function (res, res, next) {
//     res.statusCode(404).send("NOT NOUND\n");
// });

//등록
app.listen(5000, function () {
    console.log("simple api server is open")
})