const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('../JWTMiddleware');
const multer = require('multer');
const axios = require('axios');
const User = require('../models/user');
const mail = require('../mails/mail');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!config.production)
        {
            cb(null, 'client/public/assets/postImages');
        } else {
            cb(null, 'client/build/assets/postImages');
        }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});
  
const upload = multer({ storage: storage });

const fileUpload = upload.fields([
{ name: 'postImage', maxCount: 1 },
]);

router.post('/addPost', fileUpload, jwtMiddleware(), (req, res) => {

    const captchaObj = {
        secret: '6LcEZnwUAAAAAJVqpccEuGNCfHAHyeGOQVUsO7CB',
        response: req.body.recaptchaResponse
    };
    console.log(req.body.name);

    axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${captchaObj.secret}&response=${captchaObj.response}`, {}, {headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"}})
    .then(data => {
        if(data.data.success) {
            let postObj = {
                for: req.body.for,
                body: req.body.body,
                approved: false,
                fromRollnumber: req.auth.rollno,
                fromName: req.auth.name
            };
        
            if(req.files['postImage']) {
                postObj.imageName = req.files['postImage'][0].filename;
            }
            
            const newPost = new Post(postObj);
        
            Post.addPost(newPost)
            .then(data => {
                User.getUserByRollNumber(req.body.for)
                .then(user => {
                    console.log("yes");
                    mail.sendNewPostMail(user.name, postObj.fromName, user.email, (err) => {
                        if(err) {
                            console.error(`Error Sending Mail - ${err}`);
                            return res.status(500).json({
                                message: `Something went wrong`
                            });
                        } else {
                            return res.status(200).json({
                                message: `Successfully submitted post. Waiting for approval.`
                            });
                        }
                    })
                });
            })
            .catch(err => {
                console.error(`Error Adding Post - ${err}`);
                return res.status(500).json({
                    message: `Something went wrong.`
                });
            });
        } else {
            return res.status(400).json({
                message: `Invalid Captcha.`
            });
        }
    })
    .catch(err => {
        console.error(`Error Adding Post - ${err}`);
        return res.status(500).json({
            message: `Something went wrong.`
        });
    });
});

router.post(`/getPosts`, jwtMiddleware({ optional: true }), (req, res) => {
    if(req.auth && req.body.rollnumber === req.auth.rollno) {
        Post.getPosts(false, req.body.rollnumber)
        .then(data => {
            res.json({
                data: data
            });
        })
        .catch(err => {
            console.error(`Error Fetching Posts - ${err}`);
            return res.status(500).json({
                message: `Something went wrong.`
            });
        });
    } else {
        Post.getPosts(true, req.body.rollnumber)
        .then(data => {
            res.json({
                data: data
            });
        })
        .catch(err => {
            console.error(`Error Fetching Posts - ${err}`);
            return res.status(500).json({
                message: `Something went wrong.`
            });
        });
    }
});

router.post('/approvePost', jwtMiddleware(), (req, res) => {
    if(req.auth.rollno === req.body.for) {
        Post.approvePost(req.body._id)
        .then(data => {
            User.getUserByRollNumber(req.body.for)
            .then(forUser => {
                User.getUserByRollNumber(req.body.fromRollnumber)
                .then(fromUser => {
                    mail.sendPostApprovedMail(forUser.name, fromUser.name, fromUser.email, (err) => {
                        if(err) {
                            console.error(`Error Sending Mail - ${err}`);
                            return res.status(500).json({
                                message: `Something went wrong`
                            });
                        } else {
                            return res.json({
                                success: true
                            });
                        }
                    });
                })
                .catch(err => {
                    console.error(`Error fetching fromUser in approve post - ${err}`);
                    return res.status(500).json({
                        message: `Something went wrong.`
                    });
                });
            })
            .catch(err => {
                console.error(`Error fetching forUser in approve post - ${err}`);
                return res.status(500).json({
                    message: `Something went wrong.`
                });
            });
        })
        .catch(err => {
            console.error(`Error Approving Post - ${err}`);
            return res.status(500).json({
                message: `Something went wrong.`
            });
        });
    } else {
        res.status(400).json({
            message: `You are not Authorized for this action.`
        });
    }
});

router.post('/getRecentPosts', (req, res) => {
    Post.getRecentPosts()
    .then(data => {
        return res.json({
            data: data
        });
    })
    .catch(err => {
        console.error(`Error Fetching Recent Posts - ${err}`);
        return res.status(500).json({
            message: `Something went wrong.`
        });
    });
});

module.exports = router;