import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette variables for easy reference and inline style usage
const COLORS = {
  primary: '#4a90e2',
  accent: '#d0021b',
  secondary: '#ffffff'
};

// PUBLIC_INTERFACE
function App() {
  // Board state: 9 squares, "X" or "O" or null
  const [board, setBoard] = useState(Array(9).fill(null));
  // "X" is always the starting player
  const [xIsNext, setXIsNext] = useState(true);
  // Game status: "playing", "draw", "win"
  const [status, setStatus] = useState("playing");
  // The winner: "X", "O", or null
  const [winner, setWinner] = useState(null);

  // Compute winner or draw after every move
  useEffect(() => {
    const result = calculateGameResult(board);
    if (result.winner) {
      setStatus("win");
      setWinner(result.winner);
    } else if (result.isDraw) {
      setStatus("draw");
      setWinner(null);
    } else {
      setStatus("playing");
      setWinner(null);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || status !== "playing") return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(prev => !prev);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus("playing");
    setWinner(null);
  }

  // Returns: { winner: "X"|"O"|null, isDraw: true|false }
  function calculateGameResult(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6]          // diagonals
    ];
    for (let line of lines) {
      const [a,b,c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], isDraw: false };
      }
    }
    const isDraw = squares.every(sq => sq);
    return { winner: null, isDraw };
  }

  // Minimalistic message assignment
  let message = "";
  if (status === "win") {
    message = `Player ${winner} wins!`;
  } else if (status === "draw") {
    message = "It's a draw!";
  } else {
    message = `Current turn: Player ${xIsNext ? "X" : "O"}`;
  }

  // --- Render UI ---
  return (
    <div 
      className="App"
      style={{
        minHeight: "100vh",
        background: COLORS.secondary,
        color: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: 'system-ui, Arial, sans-serif'
      }}
    >
      <div
        style={{
          background: COLORS.secondary,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04), 0 1.5px 6px rgba(74,144,226,0.1)",
          padding: "2.2rem 2.8rem 2rem 2.8rem",
          maxWidth: 370,
          minWidth: 270,
          margin: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: 12,
            fontWeight: 700,
            fontSize: "2rem",
            color: COLORS.primary,
            letterSpacing: "0.05em"
          }}
        >Tic Tac Toe</h1>
        <div
          style={{
            marginBottom: status !== "playing" ? 12 : 18,
            minHeight: 24,
            fontWeight: 500,
            fontSize: "1.1rem",
            color:
              status === "win"
                ? COLORS.accent
                : status === "draw"
                ? "#606060"
                : COLORS.primary
          }}
          role="status"
          aria-live="polite"
        >{message}</div>
        <Board
          squares={board}
          onCellClick={handleClick}
          gameStatus={status}
        />
        <button
          type="button"
          onClick={handleReset}
          style={{
            marginTop: 24,
            background: COLORS.primary,
            color: COLORS.secondary,
            border: "none",
            borderRadius: 7,
            padding: "8px 28px",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: ".04em",
            cursor: "pointer",
            boxShadow: "0 1.5px 7px rgba(74,144,226,0.14)",
            transition: "background .17s"
          }}
          tabIndex={0}
          aria-label="Reset game"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/**
 * Game Board component: 3x3 grid
 * @param {*} props.squares - array of "X", "O", or null
 * @param {*} props.onCellClick - function(idx) to call on cell click
 * @param {*} props.gameStatus - "playing"|"win"|"draw"
 */
function Board({ squares, onCellClick, gameStatus }) {
  // PUBLIC_INTERFACE
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 54px)",
        gridTemplateRows: "repeat(3, 54px)",
        gap: "8px",
        margin: "0 auto",
        background: "#f4fafc",
        borderRadius: 12,
        padding: "7px",
        boxShadow: "0 1px 4px rgba(74,144,226,0.09)",
        minWidth: 0
      }}
      role="grid"
      aria-label="Tic Tac Toe board"
      tabIndex={0}
    >
      {squares.map((val, idx) => (
        <Cell
          key={idx}
          value={val}
          onClick={() => onCellClick(idx)}
          disabled={!!val || gameStatus !== "playing"}
        />
      ))}
    </div>
  );
}

/**
 * Single Cell in the board
 * @param {*} props.value - "X", "O", or null
 * @param {*} props.onClick - handle click for cell
 * @param {*} props.disabled - disables cell if true
 */
function Cell({ value, onClick, disabled }) {
  // PUBLIC_INTERFACE
  return (
    <button
      type="button"
      style={{
        width: "54px",
        height: "54px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        border: `2.4px solid #e2e8f0`,
        borderRadius: 9,
        fontSize: "2rem",
        fontWeight: 700,
        color: value === "X" ? COLORS.primary : value === "O" ? COLORS.accent : "#c5c5c5",
        cursor: disabled ? "default" : "pointer",
        outline: "none",
        transition: "background 0.18s"
      }}
      aria-label={value ? `Cell occupied by ${value}` : "Empty cell"}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
    >
      {value || ""}
    </button>
  );
}

export default App;
