import './styles.scss'
import * as BoardGameEngine from 'board-game-engine'

export { default as Game } from './components/game/game.js'
export { useGameserverConnection } from './use-gameserver-connection'
export const Client = BoardGameEngine.Client
