Real-Time Poll Rooms

A full-stack MERN application that allows users to create polls, share them via a public link, and see live voting results in real time.

Each poll is stored in MongoDB Atlas and remains accessible through a unique URL. Real-time synchronization is implemented using Socket.io with dedicated rooms per poll.

# Live Deoployment
Frontend (Vercel): https://real-time-poll-room-lovat.vercel.app/
Backend (Render): https://real-time-poll-room-8z43.onrender.com/

# Features 

Create polls with multiple options (minimum 2 required).
Generate shareable public poll link.
Real-time vote updates without page refresh.
Single-choice voting.
Persistent storage using MongoDB Atlas.
Clean and responsive UI (React + Bootstrap).
Deployed production-ready system.


# Tech Stack - 
 Frontend:- 
React (Vite)
Axios
Bootstrap
Socket.io-client

Backend -
Node.js
Express.js
MongoDB (Atlas)
Mongoose
Socket.io

Deployment-
 Frontend: Vercel
 Backend: Render
 Database: MongoDB Atlas


⚡Real-Time Implementation

Each poll functions as a dedicated Socket.io room.

Flow:
When a user opens a poll:

The client connects to the backend via Socket.io.
The client joins a room using the poll ID.
When a vote is cast:
The backend validates the request.
The vote is saved to MongoDB.
The server emits a voteUpdate event to that specific poll room.
All connected clients:
Receive updated poll data instantly.
UI updates without page refresh.

This ensures efficient real-time synchronization across multiple devices.


🔐 Fairness / Anti-Abuse Mechanisms
# IP-Based Vote Restriction (Backend)

Each vote stores the voter’s IP address.
Multiple votes from the same IP for a single poll are blocked.
Prevents basic repeated voting attempts.


Limitation:
Can be bypassed using VPN or different networks.

# LocalStorage Vote Lock (Frontend)

After voting, a flag is stored in browser localStorage.
Voting button is disabled on refresh.
Prevents accidental duplicate voting.

Limitation:
Can be bypassed by clearing browser storage.

# Edge Cases Handled

Poll must contain at least two options.
Empty or invalid inputs are rejected.
Invalid poll ID returns appropriate error.
Invalid option index is rejected.
Duplicate voting attempts blocked.
Votes persist after page refresh.
Real-time updates sync across multiple browsers/devices.
Graceful handling of backend errors.

⚠️ Known Limitations
IP-based restriction does not prevent VPN usage.
No authentication system implemented.
No CAPTCHA or advanced bot protection.
No rate limiting implemented.
Poll expiration feature not included.
 
