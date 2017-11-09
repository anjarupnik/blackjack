
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOneGame, fetchPlayers } from '../actions/games/fetch'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import JoinGameDialog from '../components/games/JoinGameDialog'
import { deal } from '../actions/games/deal'
import table from '../images/table.png'
import Button from '../components/blackjack/button'
import '../components/blackjack/blackjackboard.css'

const playerShape = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  hand: PropTypes.arrayOf(PropTypes.object).isRequired,
  score: PropTypes.number.isRequired,
  hasStood: PropTypes.bool,
  blackJack: PropTypes.bool.isRequired,
  busted: PropTypes.bool.isRequired,
  name: PropTypes.string
})

class Game extends PureComponent {
  static propTypes = {
    fetchOneGame: PropTypes.func.isRequired,
    fetchPlayers: PropTypes.func.isRequired,
    subscribeToWebsocket: PropTypes.func.isRequired,
    game: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      players: PropTypes.arrayOf(playerShape),
      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      started: PropTypes.bool,
      deck: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
    currentPlayer: playerShape,
    isPlayer: PropTypes.bool,
    isJoinable: PropTypes.bool,
  }

  componentWillMount() {
    const { game, fetchOneGame, subscribeToWebsocket } = this.props
    const { gameId } = this.props.match.params

    if (!game) { fetchOneGame(gameId) }
    subscribeToWebsocket()

  }

  componentWillReceiveProps(nextProps) {
    const { game } = nextProps

    if (game && !game.players[0].name) {
      this.props.fetchPlayers(game)
    }
  }

  deal () {
    const { game } = this.props
    this.props.deal(game)
  }

  render() {
    const { game } = this.props
    if (!game) return null

    const title = game.players.map(p => (p.name || null))
      .filter(n => !!n)
      .join(' vs ')

    return (
      <div className="Game">
        <h1>BLACKJACK</h1>
        <p>{title}</p>

        <div className="table">
        <img className="board" src={table} alt="this"/>
          <div className="buttons">
            < Button content="Hit"/>
            < Button content="Stick"/>
            <button onClick = { this.deal.bind(this) }>
               Start
            </button>
          </div>
              <div className="cardsplayer0">
                <img src={this.props.game.deck.map(c=>c.image)[3]} alt="hand"/>
              </div>
              <div className="cardsplayer1">
                <img src={this.props.game.deck.map(c=>c.image)[4]} alt="hand"/>
              </div>
              <div className="cardsplayer2">
                <img src={this.props.game.deck.map(c=>c.image)[7]} alt="hand"/>
              </div>
              <div className="cardsplayer3">
                <img src={this.props.game.deck.map(c=>c.image)[8]} alt="hand"/>
              </div>
              <div className="cardsother">
                <img src={this.props.game.deck.map(c=>c.image)[5]} alt="hand"/>
              </div>
              <div className="cardsother1">
                <img src={this.props.game.deck.map(c=>c.image)[6]} alt="hand"/>
              </div>
              <div className="cardsother2">
                <img src={this.props.game.deck.map(c=>c.image)[9]} alt="hand"/>
              </div>
              <div className="cardsother3">
                <img src={this.props.game.deck.map(c=>c.image)[10]} alt="hand"/>
              </div>
        </div>
        <JoinGameDialog gameId={game._id} />
      </div>
    )
  }
}

const mapStateToProps = ({ currentUser, games }, { match }) => {
  const game = games.filter((g) => (g._id === match.params.gameId))[0]
  const currentPlayer = game && game.players.filter((p) => (p.userId === currentUser._id))[0]
  return {
    currentPlayer,
    game,
    isPlayer: !!currentPlayer,
    isJoinable: game && !currentPlayer && game.players.length < 2
  }
}

export default connect(mapStateToProps, {
  subscribeToWebsocket,
  fetchOneGame,
  fetchPlayers,
  deal,
})(Game)
