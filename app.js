const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Assign player or spectator role
  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole");
  }

  // Send current board state immediately
  socket.emit("boardState", chess.fen());

  socket.on("disconnect", () => {
    if (socket.id === players.white) delete players.white;
    if (socket.id === players.black) delete players.black;
  });

  socket.on("move", (move) => {
    // Block any moves once the game is over
    if (chess.isGameOver()) return;

    try {
      // Validate turn
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid move:", move);
        socket.emit("Invalid Move", move);
      }
    } catch (err) {
      console.error(err);
      socket.emit("Invalid Move", move);
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
