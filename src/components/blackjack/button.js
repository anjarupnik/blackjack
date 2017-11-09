import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './button.css'

class Button extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
  }
  render(){
    return (
      <button>
      { this.props.content }
      </button>
    )
  }
}

export default Button
