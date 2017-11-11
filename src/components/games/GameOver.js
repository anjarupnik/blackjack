import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteGame } from '../../actions/games/delete'

class GameOver extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
  }

  deleteGame= () => {
    const { deleteGame, game } = this.props
    deleteGame(game)
  }

  render() {
    const { open, title } = this.props

    const actions = [
      <Link to="/">
      </Link>,
      <RaisedButton
        label="Back"
        primary={true}
        keyboardFocused={true}
        onClick={this.deleteGame}
      />,
    ]

    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
        >
          Game Over
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = ({ games }, { gameId }) => {
  const game = games.filter((g) => (g._id === gameId))[0]

  return {
    game,
    open: game.started 
  }
}

export default connect(mapStateToProps, { deleteGame })(GameOver)
