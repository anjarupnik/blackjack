import API from '../../api/client'
import {
  APP_LOADING,
  APP_DONE_LOADING,
  LOAD_ERROR,
  LOAD_SUCCESS
} from '../loading'

export const DELETE_GAME = 'DELETE_GAME'

const api = new API()

export const deleteGame = (game) => {
  return dispatch => {
    dispatch({ type: APP_LOADING })

    api.delete(`/games/${game._id}` )
      .then((res) => {
        dispatch({ type: APP_DONE_LOADING })
        dispatch({ type: LOAD_SUCCESS })
        dispatch("/")

  })
      .catch((error) => {
        dispatch({ type: APP_DONE_LOADING })
        dispatch({
          type: LOAD_ERROR,
          payload: error.message
        })
      })
}
}
