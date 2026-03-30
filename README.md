# Chess Controller 🎮♞

A real-time chess game with phone-as-controller support. Play against computer AI or with two players using your phone as the chess board controller!

## ✨ Features

- **Phone as Controller** - Use your smartphone as a touch-based chess board
- **Two Game Modes**:
  - 🤖 vs Computer - Play against AI with 3 difficulty levels
  - 👥 2 Player - Two phones control opposite sides
- **Real-time Sync** - Moves instantly reflect on both devices
- **Room Code System** - Easy connection with 4-character codes
- **QR Code Pairing** - Scan to connect instantly
- **Full Chess Rules** - En passant, castling, pawn promotion, check/checkmate
- **Move History** - Track all moves in algebraic notation
- **Responsive Design** - Works on all devices
- **Gamification** - Sound effects, animations, & celebration moments
- **Standard Chess Pieces** - Clear Unicode chess notation

## 🌐 How to Use

### Setup
1. **On Computer/TV:** Open the main display URL (index.html)
2. **On Phone:** Scan the displayed QR code or enter the room code shown on the main display
3. **Wait for connection** - Status will show "Connected" when ready

### Game Modes

#### 🤖 vs Computer
- You play as White (pieces appear on bottom)
- Computer plays as Black (pieces appear on top)
- Choose difficulty before starting:
  - **Easy** (🐣): Random moves
  - **Medium** (🐥): Prioritizes captures
  - **Hard** (🐔): Strategic evaluation

#### 👥 Two Player
- First phone connected gets White
- Second phone connected gets Black
- Players alternate turns
- Real-time board sync across both devices

### Controls

**On Main Display:**
- Click squares to make moves (test mode)
- Select game mode (AI or Two Player)
- Adjust difficulty level
- View move history
- Reset game at any time

**On Phone Controller:**
1. Tap a piece to select it (valid moves appear as glowing dots)
2. Tap a destination square to move
3. Selected piece is highlighted in bright green
4. King in check flashes bright magenta
5. View your color assignment and whose turn it is

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Communication**: WebRTC for real-time P2P connection
- **Game Logic**: Custom chess engine with full rule implementation
- **Signaling**: localStorage-based signaling (no server required)
- **Audio**: Web Audio API for sound effects

### File Structure
```
tapchess/
├── index.html              # Main display (game board)
├── controller.html         # Phone controller
├── chess-engine.js        # Complete chess rule engine
├── ai-opponent.js         # Chess AI with multiple difficulty levels
├── webrtc-connection.js   # WebRTC peer connection handling
├── gamification.js        # Sound effects & animations
└── README.md              # This file
```

### Chess Features Implemented
✅ **Movement Rules**
- All piece movements (Pawn, Rook, Bishop, Knight, Queen, King)
- Castling (kingside & queenside)
- En passant capture
- Pawn promotion

✅ **Game State**
- Check detection
- Checkmate detection  
- Stalemate recognition (draw)
- 50-move rule (draw after 100 half-moves)
- Insufficient material detection
- Move history in algebraic notation

✅ **Two-Player Support**
- Real-time board synchronization
- Turn validation
- Illegal move rejection
- Opponent move notifications

## 🎮 How to Play Chess

### Basic Rules
- **Pawns**: Move forward 1 square (2 squares from start), capture diagonally
- **Rook**: Move any number of squares horizontally or vertically
- **Bishop**: Move any number of squares diagonally
- **Knight**: Move in L-shape (2+1 or 1+2 squares)
- **Queen**: Move like rook OR bishop
- **King**: Move 1 square in any direction (can castle with rook)

### Special Moves
- **Castling**: King + Rook move together (must not be in check, no pieces between)
- **En Passant**: Pawn captures opponent's pawn that just moved 2 squares
- **Promotion**: Pawn reaching last rank becomes a Queen (or other piece)

### Winning
- **Checkmate**: Opponent's king is in check and has no legal moves
- **Resignation**: Opponent gives up
- **Draw**: Stalemate, 50-move rule, insufficient material, or agreement

## 🎵 Gamification Features

- **Move Sounds**: Different beeps for move, capture, check
- **Visual Effects**: Confetti bursts on victory, piece animations
- **Celebrations**: Pop-in overlay with messages on checkmate
- **Points System**: Track captured pieces and victories

## 🐛 Troubleshooting

### Connection Issues
- Ensure both devices are on the same network
- Try refreshing the QR code on main display
- Check browser console for error messages
- Grant WebRTC permissions when prompted

### Move Issues
- Make sure it's your turn (indicated on controller)
- Selected piece must be your color
- Destination must be a legal move (highlighted as valid)
- Can't move into check

### Display Issues
- Pieces may appear differently depending on browser/OS
- Try zooming in/out if board is hard to see
- Fullscreen mode recommended on main display

## 📝 Notes

- This is a demo version using localStorage for signaling (single machine with two windows works best)
- For production use, integrate a real signaling server (WebSocket-based)
- Web Audio API support required for sound effects
- Modern browser with WebRTC support required

## 🚀 Future Improvements

- Server-based signaling for cross-network play
- Persist games to database
- User accounts and rankings
- Replay analysis
- Time controls
- Puzzle modes
- Mobile app version

---

**Enjoy your game! ♞**