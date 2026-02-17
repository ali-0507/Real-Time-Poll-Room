const Poll = require("../models/poll");
const Vote = require("../models/vote");

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const formattedOptions = options.map((opt) => ({
      text: opt,
    }));

    const newPoll = await Poll.create({
      question,
      options: formattedOptions,
    });

    res.status(201).json({
      message: "Poll created successfully",
      pollId: newPoll._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;

    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (optionIndex === undefined || !poll.options[optionIndex]) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    // Get user IP
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Check if already voted
    const existingVote = await Vote.findOne({
      pollId: id,
      ipAddress,
    });

    if (existingVote) {
      return res.status(403).json({ message: "You have already voted." });
    }

    // Increment vote count
poll.options[optionIndex].votes += 1;
await poll.save();

const io = req.app.get("io");
io.to(id).emit("voteUpdate", poll);

    // Save vote record
    await Vote.create({
      pollId: id,
      optionIndex,
      ipAddress,
    });

    res.status(200).json({
      message: "Vote recorded successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
