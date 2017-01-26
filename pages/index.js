import React, {Component} from 'react'
import Link from 'next/link'
import { bind, curry, prop } from 'ramda'
import axios from 'axios'
import CharacterView from '../components/CharacterView'

const charactersLoaded = curry((people, state, props) => ({people: people, isLoading: false}))
const chooseCharacter = curry((id, state, props) => ({chosenChar: id}))

export default class FishWars extends Component {
  state = {
    isLoading: true,
    chosenChar: "",
    people: []
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    axios.get('https://swapi-json-server-ddpsgpqivc.now.sh/people?_limit=20')
      .then(prop('data'))
      .then(charactersLoaded)
      .then(setState)
  }

  handleCharSelect = curry((id, evt) => {
    this.setState(chooseCharacter(id))
  })

  render () {
    return (
      <div>
        { this.state.isLoading && <h4>Loading Data</h4>}
        { this.state.chosenChar && <Link href={`/play?char=${this.state.chosenChar}`}>Play The Game</Link>}
        <h1>Fish Wars</h1>
        <em>or, Starfish if you prefer</em>
        <ul>
          {this.state.people.map(person => <CharacterView key={person.id} {...person} handleCharSelect={this.handleCharSelect}/>)}
        </ul>
      </div>
    )
  }
}
