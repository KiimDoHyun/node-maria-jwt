const jwt = require("./jwt");
const db = require('../db.js');

const login = async (req,res) => {
    await db.query(`SELECT * from user;`, function(error, result){
        // console.log(result);
        // console.log(result[0].id);
        
        if(error) {
            throw error;
        }
        else {
            const {id = null, pw = null} = req.body;
            console.log(req);
            console.log(result[0]);
            console.log(id);
            console.log(pw);
            if(result[0].id === req.body.id && result[0].pw === req.body.pw) {
                const userToken = jwt.sign(req.body.id);
                res.status(200).send({
                    msg:"success",
                    token: userToken
                })
            }
            else {
                res.status(401).send({
                    msg:"id,pw 불일치"
                })
            }
        }
    })
}

const test = async(req,res) => {
    const userToken = jwt.sign(req.body.id);
    res.status(200).send({
        token: userToken,
        msg:"Tlqkf"
    })
}

module.exports = {login, test};