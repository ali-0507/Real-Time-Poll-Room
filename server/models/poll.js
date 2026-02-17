const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: [
        (val) => val.length >= 2,
        "A poll must have at least two options.",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
