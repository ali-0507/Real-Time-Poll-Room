import axios from "axios";

const API = axios.create({
  baseURL: "https://real-time-poll-room-8z43.onrender.com/api",
});

export default API;
