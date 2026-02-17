import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePoll from "./pages/createPoll";
import PollRoom from "./pages/pollRoom";

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<PollRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
