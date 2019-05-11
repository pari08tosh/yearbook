const jwt = require('jsonwebtoken')
const config = require('./config.json');

module.exports =  function(options) { 
    return function(req, res, next)  {
        
        let token = '';

        if(options) {
            if(options.type === 'input') {
                token = req.body.token
            } else {
                token = req.headers['authorization'];
            }
        } else {
            token = req.headers['authorization'];
        }
        if (!token) {
            if(options.optional) {
                return next();
            } else {
                return res.status(403).json({
                    message: 'You are not Authorized. Please login to continue.'
                });
            }
        }
        jwt.verify(token, config.secret ,function(err, decoded) {
            if(err) {
                console.error(`Error decoding Token - ${err}`);
                return res.status(403).json({
                    message: `Invalid Token. Please login again to continue.`
                });
            } else {
                req.auth = decoded;
                next();
            }
        });
}
};