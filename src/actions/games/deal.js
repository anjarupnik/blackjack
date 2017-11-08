import API from '../../api/client'
import {
  APP_LOADING,
  APP_DONE_LOADING,
  LOAD_ERROR,
  LOAD_SUCCESS
} from '../loading'
import { GAME_UPDATED } from './subscribe'

export const DEAL_CARDS = 'DEAL_CARDS'

const api = new API()

export const deal = (game) => {
  return (dispatch) => {
    dispatch({ type: APP_LOADING })

    api.patch(`/games/${game._id}`, {hand: []} )
      .then((res) => {
        dispatch({ type: APP_DONE_LOADING })
        dispatch({ type: LOAD_SUCCESS })
        dispatch({ type: GAME_UPDATED,
        payload: res.body })

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
