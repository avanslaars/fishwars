import React, {Component} from 'react'
import { compose, propOr, bind, objOf, tap } from 'ramda'
import localforage from 'localforage'

const loadCharacter = compose(objOf('character'), JSON.parse)
const log = tap(console.log)

export default class PlayFish extends Component {
  state = {
    character: {}
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    localforage.getItem('character')
      .then(compose(setState, loadCharacter))
  }

  render() {
    return (
      <div>
        Playing as {this.state.character.id}
      </div>
    )
  }
}
