import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredOptions = options.filter((opt) => opt.trim() !== "");

    if (filteredOptions.length < 2) {
      alert("At least 2 options required");
      return;
    }

    try {
      const res = await API.post("/polls", {
        question,
        options: filteredOptions,
      });

      navigate(`/poll/${res.data.pollId}`);
    } catch (error) {
      alert("Error creating poll");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h2>Create Poll</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Question</label>
          <input
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {options.map((opt, index) => (
          <div key={index} className="mb-2">
            <input
              className="form-control"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addOption}
        >
          Add Option
        </button>

        <br />

        <button className="btn btn-primary">Create Poll</button>
      </form>
    </div>
  );
}

export default CreatePoll;
