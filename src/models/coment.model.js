const { Schema, model } = require("mongoose");

const comentsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: String,
    body: String,
    likes: Array,
    replies: Array,
  },
  {
    timestamps: true,
  }
);

const Coments = model("Coments", comentsSchema);

module.exports = Coments;
