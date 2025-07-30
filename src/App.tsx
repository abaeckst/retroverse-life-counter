import { useGame } from './hooks/useGame'
import { GameSetup } from './components/GameSetup'
import { GameBoard } from './components/GameBoard'
import './App.css'

function App() {
  const { state } = useGame()

  if (!state.isSetupComplete) {
    return <GameSetup />
  }

  return <GameBoard />
}

export default App
