const express = require('express');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const config = require("./config.json");
const posts = require('./routes/posts');
const users = require('./routes/users');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/posts', posts);
app.use('/users', users);

app.use(express.static('./client/build'));

app.get('*', (req, res) => {
    //** when server is active
     res.sendFile(path.join(__dirname + '/client/build/index.html'));
  
    // When server is down
    // res.send("Server is down");
  });

mongoose
    .connect(config.dbURI, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => {
        console.error(err);
    });

app.listen(config.port, () => {
    console.log(`Server Started on port ${config.port}`);
});