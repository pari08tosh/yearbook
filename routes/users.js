const express = require('express');
const router = express.Router();
const User = require('../models/user');
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('../JWTMiddleware');
const multer = require('multer');
const mail = require('../mails/mail');
const axios = require('axios');
const bcrypt = require('bcrypt');


function generatePassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!config.production)
        {
            cb(null, 'client/public/assets/avatars');
        } else {
            cb(null, 'client/build/assets/avatars');
        }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});
  
const upload = multer({ storage: storage });

const fileUpload = upload.fields([
{ name: 'avatar', maxCount: 1 },
]);

router.post('/login', (req, res) => {
    User.getUser(req.body.username)
        .then(user => {
            if(user) {
                if(bcrypt.compareSync(req.body.password, user.password)) {
                    const token = jwt.sign({ id: user._id, username: user.username, name: user.name, rollno: (`${user.course}-${user.rollnumber}-${user.year}`).toLowerCase() }, config.secret, { expiresIn: '7d' });
                    return res.json({
                        username: user.username,
                        token: token,
                        name: user.name,
                        rollnumber: (`${user.course}-${user.rollnumber}-${user.year}`).toLowerCase()
                    });
                } else {
                    return res.status(400).json({
                        message: `Invalid Credentials.`
                    });
                }
            } else {
                return res.status(400).json({
                    message: `Invalid Credentials.`
                });
            }
        })
        .catch(err => {
            console.error(`Error Fetching User - ${err}`);
            return res.status(500).json({
                message: `Something Went Wrong`
            });
        });
});

router.post('/searchUsers', (req, res) => {
    User.searchUsers(req.body.searchString)
    .then(data => {
        res.json({
            data: data
        });
    })
    .catch(err => {
        console.error(`Error Searching Users - ${err}`);
        return res.status(500).json({
            message: `Something Went Wrong`
        });
    });
});

router.post('/getUser', (req, res) => {
    User.getUserByRollNumber(req.body.rollnumber)
    .then(data => {
        if(data) {
            res.json({
                data: data
            });
        } else {
            res.status(400).json({
                message: `User does not exist`
            });
        }
    })
    .catch(err => {
        console.error(`Error fetching user - ${err}`);
        return res.status(500).json({
            message: `Something went wrong`
        });
    });
});

router.post('/getRecentUsers', (req, res) => {
    User.getRecentUsers()
    .then(data => {
        res.json({
            data: data
        });
    })
    .catch(err => {
        console.error(`Error fetching recent users - ${err}`);
        return res.status(500).json({
            message: `Something went wrong`
        });
    });
})

router.post('/updateProfile', jwtMiddleware(), (req, res) => {
    const updatedUser = req.body;
    if(updatedUser.password === '') {
        delete updatedUser.password;
    } else {
        updatedUser.password = bcrypt.hashSync(updatedUser.password, config.saltRounds);
    }

    delete updatedUser.course;
    delete updatedUser.rollnumber;
    delete updatedUser.year;

    User.updateUser(req.auth.username, updatedUser)
    .then(data => {
        res.json({
            success: true
        });
    })
    .catch(err => {
        console.error(`Error updating user - ${err}`);
        return res.status(500).json({
            message: `Something went wrong`
        });
    })
});

router.post('/updateAvatar', fileUpload, jwtMiddleware({type: 'input'}), (req, res) => {
    const avatarName = req.files['avatar'][0].filename;
    const username = req.auth.username;

    User.updateAvatar(username, avatarName)
    .then(data => {
        res.redirect('/editProfile');
    })
    .catch(err => {
        console.error(`Error updating user - ${err}`);
        return res.status(500).json({
            message: `Something went wrong`
        });
    })
});

router.post('/forgotPassword', (req, res) => {

    const captchaObj = {
        secret: '6LcEZnwUAAAAAJVqpccEuGNCfHAHyeGOQVUsO7CB',
        response: req.body.recaptchaResponse
    };
    axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${captchaObj.secret}&response=${captchaObj.response}`, {}, {headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"}})
    .then(data => {
        if(data.data.success) {
            User.getUserByEmail(req.body.email)
            .then(data => {
                if(data) {
                    const password = generatePassword();
                    User.updatePassword(req.body.email, bcrypt.hashSync(password, config.saltRounds))
                    .then(data => {
                        mail.sendForgotPasswordMail(data.name, data.username, password, data.email, (err) => {
                            if(err) {
                                console.error(`Error Sending Mail - ${err}`);
                                return res.status(500).json({
                                    message: `Something went wrong`
                                });
                            } else {
                                return res.status(200).json({
                                    success: true
                                });
                            }
                        });
                    })
                    .catch(err => {
                        console.error(`Error updating user - ${err}`);
                        return res.status(500).json({
                            message: `Something went wrong`
                        });
                    });
                } else {
                    res.status(400).json({
                        message: `Hmm, we can't find this email.`
                    });
                }
            })
            .catch(err => {
                console.error(`Error updating user - ${err}`);
                return res.status(500).json({
                    message: `Something went wrong`
                });
            });
        } else {
            return res.status(400).json({
                message: `Invalid Captcha.`
            });
        }
    }).catch(err => {
        console.error(`Error Checking Captcha - ${err}`);
        return res.status(500).json({
            message: `Something went wrong.`
        });
    });
});

module.exports = router;