# Software Requirements Specification
## Find It First Game

### 1. Introduction

#### 1.1 Purpose
Find It First is a real-time pattern matching game where players must identify matching images between two sets of cards before time expires. The game tests players' observation skills, quick thinking, and pattern recognition abilities.

#### 1.2 Scope
The system consists of:
- Browser-based game client
- Node.js WebSocket server
- Firebase backend for authentication and score tracking
- Real-time game state management
- Progressive difficulty levels
- User account management

### 2. System Architecture

#### 2.1 Client Architecture
- **Framework**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Real-time Communication**: Socket.IO client
- **Authentication**: Firebase Auth
- **Build Tool**: Vite

#### 2.2 Server Architecture
- **Runtime**: Node.js with Express
- **Real-time Server**: Socket.IO
- **Game State Management**: In-memory with persistence
- **Database**: Firebase Firestore
- **Image Management**: Unsplash API integration

### 3. Functional Requirements

#### 3.1 Authentication System
- Anonymous play support
- Email/password registration
- Email verification
- Password reset functionality
- Profile management
- Secure session handling

#### 3.2 Game Mechanics
- **Card System**:
  - Two decks of 6 cards each
  - One guaranteed match per round
  - Dynamic card shuffling
  - Drag-and-drop matching

- **Level Progression**:
  - Progressive difficulty increase
  - Decreasing time limits
  - Increasing card complexity
  - 60 unique levels

- **Scoring System**:
  - Base score per level
  - Time bonus
  - Shuffle penalty
  - High score tracking

- **Lives System**:
  - 3 lives per game
  - Life lost on timeout/wrong match
  - Game over on 0 lives

#### 3.3 Real-time Features
- **Game State Sync**:
  - Immediate state updates
  - Reliable WebSocket connection
  - Automatic reconnection
  - State recovery

- **Score Management**:
  - Real-time score updates
  - Historical score tracking
  - Score persistence
  - Leaderboard system

### 4. Non-Functional Requirements

#### 4.1 Performance
- Initial load time < 3 seconds
- Card drag latency < 16ms
- WebSocket latency < 100ms
- Image preloading system
- Smooth animations (60 FPS)

#### 4.2 Security
- Secure WebSocket connections
- Firebase Authentication
- Score validation
- Rate limiting
- Input sanitization

#### 4.3 Scalability
- Horizontal scaling support
- Load balancing ready
- Connection pooling
- Resource optimization

#### 4.4 Reliability
- Automatic reconnection
- State persistence
- Error recovery
- Graceful degradation

### 5. User Interface

#### 5.1 Game Interface
- Responsive design
- Dark/light theme support
- Touch-friendly controls
- Accessibility support
- Clear visual feedback
- One Screen without scroll
- Multiscreen & mobile 

#### 5.2 Game Elements
- Progress indicators
- Score display
- Timer visualization
- Life counter
- Level indicator
- Match feedback

### 6. Technical Implementation

#### 6.1 Client Components
```typescript
interface GameState {
  topDeck: string[];      // Image URLs for top deck
  bottomDeck: string[];   // Image URLs for bottom deck
  timeLimit: number;      // Round time limit in ms
  startTime: number;      // Round start timestamp
  currentSetIndex: number;// Current level index
}

interface GameScore {
  score: number;          // Total score
  timestamp: Date;        // Score timestamp
  userId: string;         // Player ID
  completed: boolean;     // Game completion status
}
```

#### 6.2 Server Components
```typescript
interface GameLevel {
  timeLimit: number;      // Level time limit
  samples: {              // Card configurations
    topDeck: number[];    // Image indices
    bottomDeck: number[]; // Image indices
  }[];
}

interface GameSpace {
  deckSamples: GameLevel[];  // All game levels
  imageUrls: string[];       // Available images
}
```

### 7. Data Management

#### 7.1 Firebase Collections
- **users**: Player profiles and settings
- **scores**: Game scores and statistics
- **settings**: Game configuration

#### 7.2 Real-time Data
- Game state
- Score updates
- Player status
- Match results

### 8. Error Handling

#### 8.1 Client-side
- Connection loss recovery
- Invalid state handling
- Input validation
- Asset loading errors

#### 8.2 Server-side
- Request validation
- Rate limiting
- Error logging
- State validation

### 9. Testing Requirements

#### 9.1 Unit Testing
- Game logic
- State management
- Score calculation
- Input handling

#### 9.2 Integration Testing
- WebSocket communication
- Firebase integration
- State synchronization
- Error recovery

### 10. Deployment

#### 10.1 Client Deployment
- Static hosting (Netlify)
- CDN integration
- Asset optimization
- Cache management

#### 10.2 Server Deployment
- Node.js runtime
- Process management
- Load balancing
- Monitoring

### 11. Future Enhancements
- Multiplayer support
- Achievement system
- Social features
- Custom card sets
- Tournament mode