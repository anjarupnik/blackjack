
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOneGame } from '../actions/games/fetch'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import JoinGameDialog from '../components/games/JoinGameDialog'
import { deal } from '../actions/games/deal'
import { stick } from '../actions/games/stick'
import table from '../images/table.png'
import { deleteGame } from '../actions/games/delete'
import '../components/blackjack/blackjackboard.css'
import '../components/blackjack/button.css'
import RaisedButton from 'material-ui/RaisedButton'

const playerShape = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  hand: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasStood: PropTypes.bool,
  blackJack: PropTypes.bool.isRequired,
  busted: PropTypes.bool.isRequired,
  name: PropTypes.string
})

class Game extends PureComponent {
  static propTypes = {
    fetchOneGame: PropTypes.func.isRequired,
    subscribeToWebsocket: PropTypes.func.isRequired,
    game: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      players: PropTypes.arrayOf(playerShape),
      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      started: PropTypes.bool,
      winnerId: PropTypes.string,
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

  stick() {
    const { game } = this.props
    this.props.stick(game)
  }

  deal() {
    const { game } = this.props
    this.props.deal(game)
  }

  deleteGame() {
    const { game } = this.props
    this.props.deleteGame(game)
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
        <h1 className= "one"> Player 1 </h1>
        <h1 className="two"> Player 2 </h1>
        {game.players[0].busted === true &&
          <span className="outline end-right">BLACK</span> &&
          <span className="outline end-left">JACK </span>
            }

          <div className="start">
          { game.started === false  && game.players.length === 2 ?
             < button className = "startbutton" onClick = { this.deal.bind(this) }> Start </button> : null }
          </div>
          <div className="start">
          { game.started === true && game.turn % 2 !== 0 ?
             < button onClick = { this.deal.bind(this) } className = "hit" > Hit </button> : null }
          </div>
          <div className="player1_stick">
          { game.started === true && game.turn % 2 !== 0 ?
              < button onClick = { this.stick.bind(this) }> Stick </button> : null }
          </div>
          <div className="player2_hit" >
          { game.started === true && game.turn % 2 === 0 ?
             < button onClick = { this.deal.bind(this) }  > Hit </button> : null }
          </div>
          <div className="player2_stick">
          { game.started === true && game.turn % 2 === 0 ?
              < button onClick = { this.stick.bind(this) }> Stick </button> : null }
          </div>


          < button onClick = { this.deleteGame.bind(this) }> Back </button>


              <div className="cardsplayer0">
              { game.started === true &&
                  game.players[0].hand.map(c => <li>
                   <img src= { c.image} alt="hand"/></li>)}
              </div>
              <div className="cardsplayer1">
              { game.started === true &&
                  game.players[1].hand.map(c => <li>
                   <img src= { c.image} alt="hand"/></li>)}
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
  deal,
  stick,
  deleteGame
})(Game)
