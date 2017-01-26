import React, {Component} from 'react'
import { path } from 'ramda'

const getCharId = path(['url', 'query', 'char'])

export default class PlayFish extends Component {
  render() {
    return (
      <div>
        Playing as {getCharId(this.props)}
      </div>
    )
  }
}
