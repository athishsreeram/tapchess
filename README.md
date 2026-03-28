# Chess Controller 🎮♞

A real-time chess game with phone-as-controller support. Play against computer AI or with two players using your phone as the chess board controller!

## 🌐 Live Demo

**Main Display:** [https://athishsreeram.github.io/tapchess/](https://athishsreeram.github.io/tapchess/)

## ✨ Features

- **Phone as Controller** - Use your smartphone as a touch-based chess board
- **Two Game Modes**:
  - 🤖 vs Computer - Play against AI with 3 difficulty levels
  - 👥 Two Player - Two phones control opposite sides
- **Real-time Sync** - Moves instantly reflect on both devices
- **Room Code System** - Easy connection with 4-character codes
- **QR Code Pairing** - Scan to connect instantly
- **Full Chess Rules** - En passant, castling, pawn promotion, check/checkmate
- **Move History** - Track all moves in algebraic notation
- **Responsive Design** - Works on all devices

## 🎮 How to Play

### Setup
1. **On Computer/TV:** Open the main display URL
2. **On Phone:** Scan the QR code or enter the room code
3. **Wait for connection** - Status will show "Connected"

### Game Modes

#### 🤖 vs Computer
- You play as White (on phone)
- Computer plays as Black
- Choose difficulty: Easy (🐣), Medium (🐥), Hard (🐔)

#### 👥 Two Player
- Two phones connect as controllers
- First phone gets White, second gets Black
- Players take turns making moves on their phones

### Controls
- **Tap piece** → **Tap destination** to move
- Selected piece is highlighted green
- Valid moves show green dots
- King in check flashes red

## 🛠️ Technical Details

### Technologies Used
- HTML5, CSS3, JavaScript (Vanilla)
- WebRTC for real-time communication
- localStorage for signaling (no server required)
- Custom chess engine with full rule implementation

### File Structure