const Comment = require("../models/comment.model");
const User = require("../models/user.model");

module.exports = {
  list(req, res) {
    Comment.find()
      .then((comments) => {
        res.status(200).json({ message: "comments found", data: comments });
      })
      .catch((err) => {
        res.status(404).json({ message: "comments nor found" });
      });
  },

  show(req, res) {
    const { commentId } = req.params;

    Comment.findById(commentId)
      .then((comment) => {
        res.status(200).json({ message: "comment found", data: comment });
      })
      .catch((err) => {
        res.status(404).json({ message: "comment not found" });
      });
  },

  create(req, res) {
    const { userId } = req.params;

    Comment.create({ ...req.body, user: userId })
      .then((comment) => {
        User.findById(userId).then((user) => {
          user.comments.push(comment),
            user.save({ validateBeforeSave: false }).then(() => {
              res.status(201).json(comment);
            });
        });
      })
      .catch((err) => res.status(400).json(err));
  },

  update(req, res) {
    const { commentId } = req.params;

    Comment.findByIdAndUpdate(commentId, req.body, { new: true })
      .then((comment) => {
        res.status(200).json({ message: "Comment updated", data: comment });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Comment could not be updated", data: err });
      });
  },

  destroy(req, res) {
    const { commentId } = req.params;

    Comment.findByIdAndDelete(commentId)
      .then((comment) => {
        res.status(200).json({ message: "comment deleted", data: comment });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Comment could not be deleted", data: err });
      });
  },
};
