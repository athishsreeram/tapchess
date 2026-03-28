// ai-opponent.js - Chess AI with difficulty levels
class ChessAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty; // 'easy', 'medium', 'hard'
  }

  getMove(engine) {
    const legalMoves = engine.getAllLegalMoves(engine.currentTurn);
    if (legalMoves.length === 0) return null;
    
    switch(this.difficulty) {
      case 'easy':
        return this.getRandomMove(legalMoves);
      case 'medium':
        return this.getPriorityMove(engine, legalMoves);
      case 'hard':
        return this.getBestMove(engine, legalMoves);
      default:
        return this.getRandomMove(legalMoves);
    }
  }

  getRandomMove(legalMoves) {
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
  }

  getPriorityMove(engine, legalMoves) {
    // Prioritize captures, then random
    const captureMoves = [];
    const otherMoves = [];
    
    legalMoves.forEach(move => {
      const targetPiece = engine.getPiece(move.to.row, move.to.col);
      if (targetPiece) {
        captureMoves.push(move);
      } else {
        otherMoves.push(move);
      }
    });
    
    if (captureMoves.length > 0) {
      // Pick the best capture based on piece value
      return this.getBestCapture(engine, captureMoves);
    }
    
    return this.getRandomMove(otherMoves);
  }

  getBestCapture(engine, captureMoves) {
    let bestMove = captureMoves[0];
    let bestValue = -1;
    
    captureMoves.forEach(move => {
      const targetPiece = engine.getPiece(move.to.row, move.to.col);
      const value = this.getPieceValue(targetPiece);
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    });
    
    return bestMove;
  }

  getBestMove(engine, legalMoves) {
    let bestMove = legalMoves[0];
    let bestScore = -Infinity;
    
    legalMoves.forEach(move => {
      // Simulate move and evaluate position
      const originalPiece = engine.board[move.to.row][move.to.col];
      const movingPiece = engine.board[move.from.row][move.from.col];
      
      engine.board[move.to.row][move.to.col] = movingPiece;
      engine.board[move.from.row][move.from.col] = null;
      
      const score = this.evaluatePosition(engine);
      
      // Undo move
      engine.board[move.from.row][move.from.col] = movingPiece;
      engine.board[move.to.row][move.to.col] = originalPiece;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });
    
    return bestMove;
  }

  evaluatePosition(engine) {
    let score = 0;
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = engine.getPiece(i, j);
        if (piece) {
          const value = this.getPieceValue(piece);
          if (piece[0] === 'w') {
            score += value;
          } else {
            score -= value;
          }
        }
      }
    }
    
    // Add small random factor for variety
    score += (Math.random() - 0.5) * 0.1;
    
    return score;
  }

  getPieceValue(piece) {
    if (!piece) return 0;
    
    const values = {
      'p': 1,
      'n': 3,
      'b': 3,
      'r': 5,
      'q': 9,
      'k': 100
    };
    
    return values[piece[1]] || 0;
  }
}