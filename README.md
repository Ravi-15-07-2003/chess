# ♟️ Real-Time Multiplayer Chess Game

A web-based real-time multiplayer chess game built using Node.js, Express, Socket.io, and chess.js. The game supports two-player matches with live board updates and spectator mode.

---

## 🚀 Features

- Real-time multiplayer gameplay
- Player roles: White, Black, or Spectator (auto-assigned)
- Live game updates using WebSockets
- Game logic managed by chess.js
- Drag-and-drop chess moves
- EJS templating with custom UI
- Board state updates using FEN notation
- Mobile-responsive interface (optional to enhance)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, Socket.io
- **Game Engine:** [chess.js](https://github.com/jhlywa/chess.js)
- **Frontend:** HTML, CSS, JavaScript, EJS
- **WebSocket:** Socket.io for real-time communication

---

## 📂 Project Structure
chess-game/
│
├── public/ # Static assets (JS, CSS, images)
│ └── client.js # Frontend Socket.io + drag-drop logic
│
├── views/
│ └── index.ejs # Chessboard UI template
│
├── server.js # Main server logic
├── package.json
└── README.md



---

## 🧠 Game Logic

- A new `Chess()` object manages board state and validates moves.
- The server tracks player roles (white/black) and enforces turns.
- Only valid moves are broadcasted to all players and spectators.
- Disconnected players have their slots freed up.

---

## 🌐 How to Run Locally

### Prerequisites
- Node.js & npm installed

### Setup
```bash
git clone https://github.com/Ravi-15-07-2003/chess
cd chess-game
npm install
node server.js
Open your browser and navigate to http://localhost:3000

👤 Player Role Assignment
First player: White

Second player: Black

Others: Spectators

Roles are assigned automatically based on availability.

📸 Screenshots
(Optional – Add UI screenshots here)

📃 License
MIT License

🙋‍♂️ Author
Ravi Singh Bais



