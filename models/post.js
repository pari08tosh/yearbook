const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    imageName: {
        type: String
    },
    for: {
        type: String,
        required: true
    },
    fromRollnumber: {
        type: String,
        required: true,
    },
    fromName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now()
    },
    approved: {
        type: Boolean,
        default: false
    }
});

module.exports = Post = mongoose.model('post', PostSchema);

module.exports.getPostForUser = function(rollnumber) {
    return Post.findOne({ for: rollnumber })
};

module.exports.getRecentPosts = function() {
    return Post.
    find({approved: true}).
    sort("-date").
    limit(10);
}

module.exports.addPost = function(newPost) {
    return newPost.save();
};

module.exports.approvePost = function(id) {
    return Post.findOneAndUpdate({ _id: id }, { approved: true });
};

module.exports.getPosts = function(approved, user) {
    if(approved) {
        return Post.find({ for: user, approved: true });
    } else {
        return Post.find({ for: user });
    }
};