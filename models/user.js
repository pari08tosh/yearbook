const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
    },
    course: {
        type: String,
        required: true,
    },
    rollnumber: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    quote: {
        type: String,
    },
    about: {
        type: String,
    },
    facebookProfile: {
        type: String
    },
    linkedinProfile: {
        type: String
    },
    avatar: {
        type: String
    },
    updateTime: {
        type: Date
    }
});

module.exports = User = mongoose.model('user', UserSchema);

module.exports.getUser = function(username) {
    return User.
    findOne({ username: username });
};

module.exports.getAllUsers = function() {
    return User.
    find({});
};

module.exports.getRecentUsers = function() {
    return User.
    find({updateTime: {$exists: true}}).
    sort('-updateTime').
    limit(8).
    select("-password -username -gender");
}

module.exports.addUser = function(newUser) {
    return newUser.save();
};

module.exports.searchUsers = function(searchString) {
    return User.
    find({ name: new RegExp(searchString, "i") }).
    sort('name').
    select('-password -username -gender -about');
};

module.exports.getUserByRollNumber = function(rollnumber) {
    rollnumber = rollnumber.split('-');
    return User.findOne({
        course: rollnumber[0].toUpperCase(),
        rollnumber: Number(rollnumber[1]),
        year: Number(rollnumber[2])
    })
    .select("-password -username -gender");
};

module.exports.updateUser = function(username, user) {
    user.updateTime = Date.now();
    return User.findOneAndUpdate({ username: username }, user);
};


module.exports.updateAvatar = function(username, avatarName) {
    return User.findOneAndUpdate({ username: username }, { avatar: avatarName });
};

module.exports.getUserByEmail = function(email) {
    return User.findOne({email: email});
};

module.exports.updatePassword = function(email, password) {
    return User.findOneAndUpdate({ email: email }, { password: password });
};