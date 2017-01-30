import React, {Component} from 'react'
import Link from 'next/link'
import { bind, curry, curryN, prop, compose, identity,
  isEmpty, useWith, apply, unapply, tap, unless, eqProps } from 'ramda'
import axios from 'axios'
import localforage from 'localforage'
import CharacterView from '../components/CharacterView'

const SWAPI_URL = 'https://swapi-json-server-ddpsgpqivc.now.sh/people?_limit=20'

const log = tap(console.log)
const all = bind(Promise.all, Promise)

const chooseCharacter = curry((char, state, props) => isEmpty(char) ? state : ({chosenChar: char}))
const createMountState = (peeps, char) => ({people: peeps, isLoading: false, chosenChar: char})
const promisesToMountState = apply(useWith(createMountState, [prop('data'), JSON.parse]))
const loadData = useWith(unapply(all), [axios.get, localforage.getItem])
const setItem = curry((propName, propValue) => localforage.setItem(propName, propValue))
const saveCharacter = compose(setItem('character'), JSON.stringify)

export default class FishWars extends Component {
  state = {
    isLoading: true,
    chosenChar: {},
    people: []
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    loadData(SWAPI_URL, 'character')
      .then(compose(setState, promisesToMountState))
  }

  handleCharSelect = curry((character, evt) => {
    this.setState(chooseCharacter(character))
  })

  componentDidUpdate(prevProps, prevState) {
    unless(
      eqProps('chosenChar', this.state, prevState),
      saveCharacter(this.state.chosenChar)
    )
  }

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
