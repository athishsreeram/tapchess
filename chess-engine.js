// chess-engine.js - Complete chess engine with move validation
class ChessEngine {
  constructor() {
    this.board = this.getInitialBoard();
    this.currentTurn = 'white';
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.enPassantTarget = null;
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
  }

  getInitialBoard() {
    return [
      ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
      ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
      ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
  }

  // Get piece at position
  getPiece(row, col) {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      return this.board[row][col];
    }
    return null;
  }

  // Check if a move is valid
  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece) return false;
    
    // Check if it's the correct player's turn
    const pieceColor = piece[0] === 'w' ? 'white' : 'black';
    if (pieceColor !== this.currentTurn) return false;
    
    // Check if destination has own piece
    const targetPiece = this.getPiece(toRow, toCol);
    if (targetPiece && targetPiece[0] === piece[0]) return false;
    
    // Get piece type
    const pieceType = piece[1];
    
    // Validate piece movement
    let isValid = false;
    switch(pieceType) {
      case 'p': isValid = this.isValidPawnMove(fromRow, fromCol, toRow, toCol, pieceColor); break;
      case 'n': isValid = this.isValidKnightMove(fromRow, fromCol, toRow, toCol); break;
      case 'b': isValid = this.isValidBishopMove(fromRow, fromCol, toRow, toCol); break;
      case 'r': isValid = this.isValidRookMove(fromRow, fromCol, toRow, toCol); break;
      case 'q': isValid = this.isValidQueenMove(fromRow, fromCol, toRow, toCol); break;
      case 'k': isValid = this.isValidKingMove(fromRow, fromCol, toRow, toCol); break;
    }
    
    if (!isValid) return false;
    
    // Check if move puts own king in check
    return !this.wouldBeCheck(fromRow, fromCol, toRow, toCol, pieceColor);
  }

  isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    const targetPiece = this.getPiece(toRow, toCol);
    
    // Move forward one square
    if (toCol === fromCol && toRow === fromRow + direction && !targetPiece) {
      return true;
    }
    
    // Move forward two squares from starting position
    if (toCol === fromCol && toRow === fromRow + (2 * direction) && 
        fromRow === startRow && !targetPiece && 
        !this.getPiece(fromRow + direction, fromCol)) {
      return true;
    }
    
    // Capture diagonally
    if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
      if (targetPiece) return true;
      
      // En passant
      if (this.enPassantTarget && 
          toRow === this.enPassantTarget.row && 
          toCol === this.enPassantTarget.col) {
        return true;
      }
    }
    
    return false;
  }

  isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
    return this.isClearPath(fromRow, fromCol, toRow, toCol);
  }

  isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return this.isClearPath(fromRow, fromCol, toRow, toCol);
  }

  isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    return this.isValidBishopMove(fromRow, fromCol, toRow, toCol) ||
           this.isValidRookMove(fromRow, fromCol, toRow, toCol);
  }

  isValidKingMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    // Normal move
    if (rowDiff <= 1 && colDiff <= 1) return true;
    
    // Castling - 2 squares horizontally
    if (rowDiff === 0 && colDiff === 2) {
      const row = fromRow;
      const rookKingCol = toCol > fromCol ? 7 : 0;
      const rookPiece = this.getPiece(row, rookKingCol);
      
      // Check rook exists and path is clear
      if (rookPiece && rookPiece[1] === 'r' && rookPiece[0] === this.currentTurn[0]) {
        return this.isClearPath(row, Math.min(fromCol, toCol), row, Math.max(fromCol, toCol));
      }
    }
    
    return false;
  }

  isClearPath(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
    
    while (row !== toRow || col !== toCol) {
      if (this.getPiece(row, col)) return false;
      row += rowStep;
      col += colStep;
    }
    return true;
  }

  wouldBeCheck(fromRow, fromCol, toRow, toCol, color) {
    // Simulate the move
    const originalPiece = this.board[toRow][toCol];
    const movingPiece = this.board[fromRow][fromCol];
    
    this.board[toRow][toCol] = movingPiece;
    this.board[fromRow][fromCol] = null;
    
    const isInCheck = this.isInCheck(color);
    
    // Undo the move
    this.board[fromRow][fromCol] = movingPiece;
    this.board[toRow][toCol] = originalPiece;
    
    return isInCheck;
  }

  isInCheck(color) {
    const kingPos = this.findKing(color);
    if (!kingPos) return false;
    
    const opponentColor = color === 'white' ? 'black' : 'white';
    
    // Check if any opponent piece can capture the king (without recursion)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.getPiece(i, j);
        if (piece && piece[0] === (opponentColor === 'white' ? 'w' : 'b')) {
          if (this.canPieceCaptureKing(i, j, kingPos)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  canPieceCaptureKing(fromRow, fromCol, kingPos) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece) return false;
    
    const pieceType = piece[1];
    const color = piece[0] === 'w' ? 'white' : 'black';
    
    let canCapture = false;
    switch(pieceType) {
      case 'p': canCapture = this.isValidPawnMove(fromRow, fromCol, kingPos.row, kingPos.col, color); break;
      case 'n': canCapture = this.isValidKnightMove(fromRow, fromCol, kingPos.row, kingPos.col); break;
      case 'b': canCapture = this.isValidBishopMove(fromRow, fromCol, kingPos.row, kingPos.col); break;
      case 'r': canCapture = this.isValidRookMove(fromRow, fromCol, kingPos.row, kingPos.col); break;
      case 'q': canCapture = this.isValidQueenMove(fromRow, fromCol, kingPos.row, kingPos.col); break;
      case 'k': 
        const rowDiff = Math.abs(kingPos.row - fromRow);
        const colDiff = Math.abs(kingPos.col - fromCol);
        canCapture = rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
        break;
    }
    return canCapture;
  }

  findKing(color) {
    const piecePrefix = color === 'white' ? 'w' : 'b';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.getPiece(i, j);
        if (piece === `${piecePrefix}k`) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }
    
    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    const pieceType = piece[1];
    
    // Handle en passant capture
    if (pieceType === 'p' && this.enPassantTarget && 
        toRow === this.enPassantTarget.row && toCol === this.enPassantTarget.col) {
      const captureRow = piece[0] === 'w' ? toRow + 1 : toRow - 1;
      this.board[captureRow][toCol] = null;
    }
    
    // Move the piece
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    
    // Handle pawn promotion - store promotion info for UI to handle choice
    if (pieceType === 'p' && (toRow === 0 || toRow === 7)) {
      this.board[toRow][toCol] = `${piece[0]}q`; // Default to queen
      this.lastPromotionPiece = { row: toRow, col: toCol, color: piece[0] };
    }
    
    // Update en passant target
    this.enPassantTarget = null;
    if (pieceType === 'p' && Math.abs(toRow - fromRow) === 2) {
      this.enPassantTarget = {
        row: (fromRow + toRow) / 2,
        col: fromCol
      };
    }
    
    // Record move
    this.moveHistory.push({
      piece,
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      captured: capturedPiece,
      notation: this.getAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, capturedPiece)
    });
    
    // Update half-move clock for 50-move rule
    if (pieceType === 'p' || capturedPiece) {
      this.halfMoveClock = 0;
    } else {
      this.halfMoveClock++;
    }
    
    // Update full move number
    if (this.currentTurn === 'black') {
      this.fullMoveNumber++;
    }
    
    // Check game over conditions
    this.checkGameOver();
    
    // Switch turns
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    
    return true;
  }

  checkGameOver() {
    const color = this.currentTurn;
    const hasLegalMoves = this.hasAnyLegalMove(color);
    
    if (!hasLegalMoves) {
      this.gameOver = true;
      if (this.isInCheck(color)) {
        this.winner = color === 'white' ? 'black' : 'white';
      } else {
        this.winner = 'draw';
      }
    }
    
    // Check for 50-move rule (100 half-moves)
    if (this.halfMoveClock >= 100) {
      this.gameOver = true;
      this.winner = 'draw';
    }
    
    // Check for insufficient material
    if (this.isInsufficientMaterial()) {
      this.gameOver = true;
      this.winner = 'draw';
    }
  }

  hasAnyLegalMove(color) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.getPiece(i, j);
        if (piece && piece[0] === (color === 'white' ? 'w' : 'b')) {
          for (let k = 0; k < 8; k++) {
            for (let l = 0; l < 8; l++) {
              if (this.isValidMove(i, j, k, l)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  isInsufficientMaterial() {
    let pieces = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.getPiece(i, j);
        if (piece && piece[1] !== 'k') {
          pieces.push(piece);
        }
      }
    }
    
    // King vs King
    if (pieces.length === 0) return true;
    
    // King + Knight vs King
    if (pieces.length === 1 && pieces[0][1] === 'n') return true;
    
    // King + Bishop vs King
    if (pieces.length === 1 && pieces[0][1] === 'b') return true;
    
    return false;
  }

  getAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, captured) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    let notation = '';
    
    if (piece[1] !== 'p') {
      notation += piece[1].toUpperCase();
    }
    
    if (captured) {
      if (piece[1] === 'p') {
        notation += files[fromCol];
      }
      notation += 'x';
    }
    
    notation += files[toCol] + ranks[toRow];
    
    return notation;
  }

  getFEN() {
    let fen = '';
    
    // Board position
    for (let i = 0; i < 8; i++) {
      let emptyCount = 0;
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          let pieceChar = piece[1];
          if (piece[1] === 'n') pieceChar = 'n';
          if (piece[0] === 'w') {
            fen += pieceChar.toUpperCase();
          } else {
            fen += pieceChar.toLowerCase();
          }
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount;
      }
      if (i < 7) fen += '/';
    }
    
    // Active color
    fen += ' ' + (this.currentTurn === 'white' ? 'w' : 'b');
    
    // Castling availability (simplified)
    fen += ' KQkq';
    
    // En passant target
    if (this.enPassantTarget) {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      fen += ' ' + files[this.enPassantTarget.col] + (this.enPassantTarget.row + 1);
    } else {
      fen += ' -';
    }
    
    // Halfmove and fullmove
    fen += ' ' + this.halfMoveClock;
    fen += ' ' + this.fullMoveNumber;
    
    return fen;
  }

  loadFromFEN(fen) {
    const parts = fen.split(' ');
    const boardPart = parts[0];
    const rows = boardPart.split('/');
    
    // Reset board
    this.board = Array(8).fill().map(() => Array(8).fill(null));
    
    // Load board
    for (let i = 0; i < 8; i++) {
      let col = 0;
      for (let j = 0; j < rows[i].length; j++) {
        const char = rows[i][j];
        if (isNaN(char)) {
          let piece = '';
          if (char === char.toUpperCase()) {
            piece = 'w' + char.toLowerCase();
          } else {
            piece = 'b' + char;
          }
          this.board[i][col] = piece;
          col++;
        } else {
          col += parseInt(char);
        }
      }
    }
    
    // Set current turn
    this.currentTurn = parts[1] === 'w' ? 'white' : 'black';
    
    // Reset other state (simplified)
    this.enPassantTarget = null;
    this.gameOver = false;
    this.winner = null;
  }

  getLegalMovesForPiece(row, col) {
    const moves = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.isValidMove(row, col, i, j)) {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  }

  getAllLegalMoves(color) {
    const moves = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.getPiece(i, j);
        if (piece && piece[0] === (color === 'white' ? 'w' : 'b')) {
          const pieceMoves = this.getLegalMovesForPiece(i, j);
          pieceMoves.forEach(move => {
            moves.push({
              from: { row: i, col: j },
              to: move
            });
          });
        }
      }
    }
    return moves;
  }

  resetGame() {
    this.board = this.getInitialBoard();
    this.currentTurn = 'white';
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.enPassantTarget = null;
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
  }
}