import React, { useState } from 'react';
import { CardDeck } from './components/CardDeck';
import { ReloadButton } from './components/ReloadButton';
import { StartButton } from './components/StartButton';
import { StopButton } from './components/StopButton';
import { ProgressBar } from './components/ProgressBar';
import { SuccessMessage } from './components/SuccessMessage';
import { LivesIndicator } from './components/LivesIndicator';
import { LevelIndicator } from './components/LevelIndicator';
import { ScoreIndicator } from './components/ScoreIndicator';
import { Menu } from './components/Menu';
import { Layout } from './components/Layout';
import { ImagePreloader } from './components/ImagePreloader';
import { LoadingState } from './components/LoadingState';
import { DragProvider } from './contexts/DragContext';
import { GameProvider } from './contexts/GameContext';
import { useGameContext } from './contexts/GameContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { AuthRequired } from './components/AuthRequired';
import { ProfileModal } from './components/ProfileModal';
import { StopConfirmModal } from './components/StopConfirmModal';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { useAuth } from './contexts/AuthContext';
import { useSocket } from './contexts/SocketContext';

function GameContent() {
  const { gameData, isGenerating } = useSocket();
  const { 
    gameState, 
    isGameOver, 
    isSuccess,
    isStarted,
    startGame,
    stopGame,
    loadNewCards,
    isLoading
  } = useGameContext();

  const [isPreloaded, setIsPreloaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showVerifyBanner, setShowVerifyBanner] = useState(true);
  const { user } = useAuth();

  const handleStopGame = () => {
    setShowStopConfirm(false);
    stopGame();
  };

  // Reset preloaded state when new game data arrives
  React.useEffect(() => {
    if (gameData) {
      setIsPreloaded(false);
    }
  }, [gameData]);

  // Show loading overlay when:
  // 1. Initial load (no gameData)
  // 2. Generating new game
  // 3. Game data exists but images haven't been preloaded
  const showLoading = isGenerating || (gameData && !isPreloaded);
  // const showLoading = !gameData || isGenerating || (gameData && !isPreloaded);

  if (showLoading) {
    return (
      <Layout>
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
          {isGenerating ? (
            <LoadingState 
              message="Generating New Game..."
              subMessage="Please wait while we create a unique game experience for you"
            />
          ) : !gameData ? (
            <LoadingState 
              message="Loading Game..."
              subMessage="Please wait while we set up your game"
            />
          ) : !isPreloaded ? (
            <ImagePreloader onComplete={() => setIsPreloaded(true)} />
          ) : null}
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Menu onProfileClick={() => setShowProfileModal(true)} />
        {/* <UserMenu onAuthClick={() => setShowAuthModal(true)} /> */}
        <AuthRequired onAuthClick={() => setShowAuthModal(true)} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Menu onProfileClick={() => setShowProfileModal(true)} />
      {user && !user.emailVerified && !user.isAnonymous && showVerifyBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <EmailVerificationBanner onClose={() => setShowVerifyBanner(false)} />
        </div>
      )}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <StopConfirmModal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        onConfirm={handleStopGame}
      />
      <header className="flex-none text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Find It First</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Find a match before time expires</p>
        <div className="mt-2 px-4 max-w-md mx-auto space-y-2">
          <div className="flex justify-center items-center gap-4">
            <LivesIndicator />
            <LevelIndicator />
            <ScoreIndicator />
          </div>
          <ProgressBar 
            timeLimit={gameState.timeLimit}
            startTime={gameState.startTime}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-between gap-4 relative">
        <section className="flex-1">
          <CardDeck deckId="top" images={gameState.topDeck} />
        </section>
        
        <section className="flex-1">
          <CardDeck deckId="bottom" images={gameState.bottomDeck} />
        </section>

        {isGameOver && <SuccessMessage />}
      </main>

      <footer className="flex-none flex justify-center gap-4 pt-2">
        {!isGameOver && (
          isStarted ? (
            <>
              <StopButton onClick={() => setShowStopConfirm(true)} />
              <ReloadButton onClick={loadNewCards} />
            </>
          ) : (
            <StartButton onClick={startGame} />
          )
        )}
      </footer>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <GameProvider>
            <DragProvider>
              <GameContent />
            </DragProvider>
          </GameProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;