# RetroVerse Life Counter

🚀 **Live Demo**: [Play Now](https://abaeckst.github.io/retroverse-life-counter/)

A cyberpunk-themed digital life counter for RetroVerse TCG that tracks boss health, tokens, and priority for 2-4 players.

## Features

✨ **Game Management**
- Support for 2-4 players with customizable names
- Adjustable starting boss health (13-20)
- Initiative randomization and manual priority control
- Game state persistence with localStorage

⚡ **Player Tracking**
- Boss health with color-coded status indicators
- Token management with automatic level resets
- Player elimination and restoration system
- Active player indication with dramatic visual effects

🎨 **Cyberpunk Theme**
- Dark gradient backgrounds with neon accents
- Player-specific colors (Cyan, Magenta, Green, Yellow)
- Glowing effects and smooth animations
- Mobile-responsive design with haptic feedback

## Tech Stack

- **React 19** + **TypeScript** for type-safe UI development
- **Vite** for fast development and optimized builds
- **Vitest** + **Testing Library** for comprehensive testing
- **GitHub Actions** for automated CI/CD deployment

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Requirements

- Node.js 22+ (required for Vite 7)
- Modern browser with localStorage support

## Game Rules

1. **Setup**: Choose 2-4 players, set starting health, optionally randomize initiative
2. **Gameplay**: Track boss health and tokens, pass priority between players
3. **Level Progression**: Advance levels to reset tokens and rotate initiative
4. **Victory**: Last player standing wins when all others are eliminated

## Architecture

- **State Management**: React Context with reducer pattern
- **Type Safety**: Complete TypeScript coverage with discriminated unions
- **Testing**: 22 unit tests covering game logic and state management
- **Persistence**: Automatic game state saving with quick restart memory

---

Made with ❤️ and **Claude Code**