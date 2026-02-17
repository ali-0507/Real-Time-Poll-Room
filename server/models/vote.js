const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    optionIndex: {
      type: Number,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
