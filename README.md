# ♟ Tap Chess - Phone Controller Architecture

A complete chess game using a **phone-as-controller** architecture, where your TV/laptop acts as the display and your phone acts as the input device — connected via WebRTC peer-to-peer.

# Live Url 

[Tap chess](https://athishsreeram.github.io/tapchess/) 
[Tap chess Controller](https://athishsreeram.github.io/tapchess/controller.html) 




## Architecture

**Step 1: Display creates room**
- Display (TV/Laptop) opens index.html
- Generates 4-character room code (e.g., "AB12")
- Shows QR code and room code on screen

**Step 2: Phone connects**
- Phone opens controller.html
- Scans QR code or enters room code
- WebRTC connection established via PeerJS

**Step 3: Game flow**
- Phone sends move commands → Display
- Display validates moves and updates board
- Display sends game state → Phone
- Display updates move history and shows results

**Step 4: Game modes**
- **vs Computer**: Display controls AI opponent
- **Two Players**: Two phones connect (White and Black)

## Files

| File | Purpose | Device |
|---|---|---|
| `index.html` | Display / Game Host | TV, Laptop, Desktop |
| `controller.html` | Touch Input Controller | Phone, Tablet |

## How to Play

### Setup

1. **Serve both files** from any web server:
   ```bash
   # Python
   python3 -m http.server 8080

   # Node.js
   npx serve .

   # Or deploy to any static host (Netlify, Vercel, GitHub Pages, etc.)
   ```

2. **Open `index.html`** on your TV or laptop (the display device).

3. **Select a game mode**:
   - 🤖 **Play vs Computer** — one phone controller needed
   - 👥 **Two Players** — two phone controllers needed

4. **Connect your phone**:
   - A QR code and 4-character room code appear on the display
   - On your phone, open `controller.html`
   - Enter the room code (or scan the QR code)
   - The connection is established via WebRTC (peer-to-peer)

5. **Play chess!**
   - Tap a piece on your phone to select it
   - Green dots show valid moves
   - Tap a destination to move
   - The display updates in real-time

### Game Modes

**vs Computer (AI)**
- One phone connects as White
- AI plays as Black with three difficulty levels:
  - **Easy**: Random legal moves
  - **Medium**: Prefers captures and checks
  - **Hard**: Positional evaluation with tactical awareness

**Two Players**
- First phone connects as White
- Second phone connects as Black
- Each player sees the board from their perspective

## Features

- **Full chess rules**: Castling, en passant, pawn promotion, check/checkmate/stalemate detection
- **Move history**: Algebraic notation displayed on the TV display panel
- **Sound effects**: Web Audio API beeps for moves, captures, checks, and wins
- **Haptic feedback**: Phone vibration on moves and events
- **Visual indicators**: Last move highlight, check warnings, valid move dots
- **Confetti celebration**: Canvas confetti on checkmate
- **Reconnection support**: Game state preserved on display if controller disconnects
- **Responsive design**: Works on any screen size

## Technical Details

### Dependencies (loaded via CDN)

- [chess.js v0.10.3](https://github.com/jhlywa/chess.js) — Chess engine and move validation
- [PeerJS v1.4.7](https://peerjs.com/) — WebRTC peer-to-peer connections
- [qrcode.js v1.0.0](https://github.com/davidshimjs/qrcodejs) — QR code generation
- [canvas-confetti v1](https://github.com/catdad/canvas-confetti) — Win celebration effects

### Data Flow

- **Controller → Display**: Move commands (`{ from, to, promotion }`)
- **Display → Controller**: Game state updates (FEN, turn, history, valid moves)
- **Display**: Source of truth — runs chess engine, validates all moves
- **Controller**: Input-only — sends intentions, never validates

### Browser Support

- Chrome 80+ ✅
- Safari 14+ ✅
- Firefox 80+ ✅
- Edge 80+ ✅

Requires WebRTC DataChannel support. Vibration API is optional (graceful fallback).

## Development

No build step required. Edit the HTML files directly and refresh. All styles and scripts are inlined for simplicity.

## License

MIT
