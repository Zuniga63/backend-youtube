const Coment = require("../models/coment.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");

module.exports = {
  list(req, res) {
    Coment.find()
      .then((coments) => {
        res.status(200).json({ message: "coments found", data: coments });
      })
      .catch((err) => {
        res.status(404).json({ message: "coments nor found" });
      });
  },

  show(req, res) {
    const { comentId } = req.params;

    Coment.findById(comentId)
      .then((coment) => {
        res.status(200).json({ message: "coment found", data: coment });
      })
      .catch((err) => {
        res.status(404).json({ message: "coment not found" });
      });
  },

  create(req, res) {
    const { userId } = req.params;

    Coment.create({ ...req.body, user: userId })
      .then((coment) => {
        User.findById(userId).then((user) => {
          user.coments.push(coment),
            user.save({ validateBeforeSave: false }).then(() => {
              res.status(201).json(coment);
            });
        });
      })
      .catch((err) => res.status(400).json(err));
  },

  update(req, res) {
    const { comentId } = req.params;

    Coment.findByIdAndUpdate(comentId, req.body, { new: true })
      .then((coment) => {
        res.status(200).json({ message: "Coment updated", data: coment });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Coment could not be updated", data: err });
      });
  },

  destroy(req, res) {
    const { comentId } = req.params;

    Coment.findByIdAndDelete(comentId)
      .then((coment) => {
        res.status(200).json({ message: "coment deleted", data: coment });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Coment could not be deleted", data: err });
      });
  },
};
