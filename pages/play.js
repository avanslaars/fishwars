import React, {Component} from 'react'
import { curry, bind } from 'ramda'
import localforage from 'localforage'

const setChar = curry((id, state, prop) => ({characterId: id}))

export default class PlayFish extends Component {
  state = {}

  componentDidMount() {
    const setState = bind(this.setState, this)
    localforage.getItem('character')
      .then(setChar)
      .then(setState)
  }

  render() {
    return (
      <div>
        Playing as {this.state.characterId}
      </div>
    )
  }
}
