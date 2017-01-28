import React, {Component} from 'react'
import Link from 'next/link'
import { bind, curry, prop, compose, identity, isEmpty, useWith, apply } from 'ramda'
import axios from 'axios'
import localforage from 'localforage'
import CharacterView from '../components/CharacterView'

const chooseCharacter = curry((char, state, props) => isEmpty(char) ? state : ({chosenChar: char}))
const createMountState = (peeps, char) => ({people: peeps, isLoading: false, chosenChar: char})
const promisesToMountState = apply(useWith(createMountState, [prop('data'), JSON.parse]))

export default class FishWars extends Component {
  state = {
    isLoading: true,
    chosenChar: {},
    people: []
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    Promise.all([
      axios.get('https://swapi-json-server-ddpsgpqivc.now.sh/people?_limit=20'),
      localforage.getItem('character')
    ]).then(promisesToMountState)
      .then(setState)
  }

  handleCharSelect = curry((character, evt) => {
    localforage
      .setItem('character', JSON.stringify(character))
      .then(() => this.setState(chooseCharacter(character)))
  })

  render () {
    return (
      <div>
        { this.state.isLoading && <h4>Loading Data</h4>}
        { this.state.chosenChar && <Link href='/play'><a href="#">Play The Game</a></Link>}
        <h1>Fish Wars</h1>
        <em>or, Starfish if you prefer</em>
        <ul>
          {this.state.people.map(person => <CharacterView
            {...person}
            key={person.id}
            selectedChar={this.state.chosenChar}
            handleCharSelect={this.handleCharSelect(person)}/>)}
        </ul>
      </div>
    )
  }
}
