const socket = io();
const chess  = new Chess();
const boardEl = document.querySelector(".chessboard");

let draggedPiece  = null;
let sourceSquare  = null;
let playerRole    = null;

/** Render the board grid, pieces, and attach drag‑&‑drop. */
function renderBoard() {
  boardEl.innerHTML = "";

  chess.board().forEach((row, r) => {
    row.forEach((piece, c) => {
      // Create square
      const sq = document.createElement("div");
      const isLight = (r + c) % 2 === 0;
      sq.classList.add("square", isLight ? "light" : "dark");

      // ← New: add algebraic notation to each square
      const file = String.fromCharCode(97 + c);
      const rank = 8 - r;
      sq.dataset.square = `${file}${rank}`;
      sq.dataset.row    = r;
      sq.dataset.col    = c;

      // If there's a piece, render it
      if (piece) {
        const el = document.createElement("div");
        el.classList.add("piece", piece.color === 'w' ? "white" : "black");
        el.innerText = getPieceUnicode(piece);
        el.draggable = (playerRole === piece.color);
        // Drag handlers
        el.addEventListener("dragstart", e => {
          if (el.draggable) {
            draggedPiece  = el;
            sourceSquare  = { r, c };
            e.dataTransfer.setData("text/plain", "");
          }
        });
        el.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });
        sq.appendChild(el);
      }

      // Drop target
      sq.addEventListener("dragover", e => e.preventDefault());
      sq.addEventListener("drop", e => {
        e.preventDefault();
        if (!draggedPiece) return;
        const target = { r, c };
        const move = {
          from: `${String.fromCharCode(97 + sourceSquare.c)}${8 - sourceSquare.r}`,
          to:   `${String.fromCharCode(97 + c)}${8 - r}`,
          promotion: 'q'
        };
        socket.emit("move", move);
      });

      boardEl.appendChild(sq);
    });
  });

  // Flip board if black
  boardEl.classList.toggle("flipped", playerRole === 'b');

  // After drawing everything, handle check/checkmate UI
  handleCheckAndMessages();
}

/** Unicode glyphs for pieces. */
function getPieceUnicode(p) {
  const map = { p:"♟", n:"♞", b:"♝", r:"♜", q:"♛", k:"♚",
                P:"♙", N:"♘", B:"♗", R:"♖", Q:"♕", K:"♔" };
  return map[p.type] || "";
}

/** Find the king’s square for a given color. */
function findKingSquare(color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = chess.board()[r][c];
      if (p && p.type==='k' && p.color===color) {
        return `${String.fromCharCode(97 + c)}${8 - r}`;
      }
    }
  }
  return null;
}

/** Highlight or clear the “in-check” class. */
function removeHighlights() {
  boardEl.querySelectorAll('.in-check')
         .forEach(el => el.classList.remove('in-check'));
}
function highlightKingSquare(square) {
  const sqEl = boardEl.querySelector(`[data-square='${square}']`);
  if (sqEl) sqEl.classList.add('in-check');
}

/** Show end‑of‑game alerts. */
function displayResult(isSpectator) {
  // turn() gives side to move; if in checkmate, that side lost.
  const loser  = chess.turn() === 'w' ? 'White' : 'Black';
  const winner = loser === 'White' ? 'Black' : 'White';

  if (isSpectator) {
    alert(`${winner} wins!\n${loser} loses!`);
  } else {
    alert(playerRole === winner.charAt(0).toLowerCase()
      ? 'You won!' : 'You lose!');
  }
}

/** Central handler after each board update. */
function handleCheckAndMessages() {
  removeHighlights();

  if (chess.in_checkmate()) {
    displayResult(playerRole === null);
  }
  else if (chess.in_check()) {
    highlightKingSquare(findKingSquare(chess.turn()));
  }
}

// Socket event wiring:
socket.on("playerRole", role => {
  playerRole = role;
  renderBoard();
});
socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});
socket.on("boardState", fen => {
  chess.load(fen);
  renderBoard();
});
socket.on("move", move => {
  chess.move(move);
  renderBoard();
});

// Initial render (empty board until first FEN arrives)
renderBoard();


/*r --> rowindex 
c --> colindex(squareindex)
sq --> squareElement
*/
