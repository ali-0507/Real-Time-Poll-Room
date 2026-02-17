import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function PollRoom() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch poll
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await API.get(`/polls/${id}`);
        setPoll(res.data);

        // Check localStorage
        if (localStorage.getItem(`voted_${id}`)) {
          setHasVoted(true);
        }
      } catch (error) {
        alert("Poll not found");
      }
    };

    fetchPoll();
  }, [id]);

  // Join socket room
  useEffect(() => {
    socket.emit("joinPollRoom", id);

    socket.on("voteUpdate", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("voteUpdate");
    };
  }, [id]);

  const handleVote = async (index) => {
    if (hasVoted) return;

    try {
      await API.post(`/polls/${id}/vote`, {
        optionIndex: index,
      });

      localStorage.setItem(`voted_${id}`, "true");
      setHasVoted(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error voting");
    }
  };

  if (!poll) return <h4>Loading...</h4>;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const maxVotes = Math.max(...poll.options.map((opt) => opt.votes));

   return (
  <div className="card p-4 shadow">

    {/* Share Button */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="mb-0">{poll.question}</h3>

      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Share link copied!");
        }}
      >
        Copy Link
      </button>
    </div>

    {/* Total Votes */}
    <p className="text-muted">
      Total Votes: <strong>{totalVotes}</strong>
    </p>

    {poll.options.map((option, index) => {
      const percentage = totalVotes
        ? ((option.votes / totalVotes) * 100).toFixed(1)
        : 0;

      const isWinner = option.votes === maxVotes && maxVotes > 0;

      return (
        <div key={index} className="mb-4">
          <button
            className={`btn w-100 ${
              isWinner
                ? "btn-success"
                : "btn-outline-primary"
            }`}
            onClick={() => handleVote(index)}
            disabled={hasVoted}
          >
            {option.text}
          </button>

          <div className="mt-2">
            <div className="progress">
              <div
                className={`progress-bar ${
                  isWinner ? "bg-success" : ""
                }`}
                role="progressbar"
                style={{ width: `${percentage}%` }}
              >
                {option.votes} votes ({percentage}%)
              </div>
            </div>
          </div>
        </div>
      );
    })}

    {hasVoted && (
      <div className="alert alert-info mt-3">
        You have already voted.
      </div>
    )}
  </div>
);

}

export default PollRoom;
