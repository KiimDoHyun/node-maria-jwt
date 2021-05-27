const jwt = require('jsonwebtoken');
const secretKey = require('../config/key').secretKey;
const options = require('../config/key').options;

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async(user) => {
        const payload = {
            idx: user,
        };
        const token = jwt.sign(payload, secretKey, options)
        return token;
    },
    verify: async(token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch(err) {
            if(err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            }
            else if(err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else  {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}