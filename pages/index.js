import React, {Component} from 'react'
import Link from 'next/link'
import { bind, curry, prop, compose, identity } from 'ramda'
import crocks from 'crocks'
import axios from 'axios'
import localforage from 'localforage'
import CharacterView from '../components/CharacterView'

const {Async, ifElse, isNil, tap, isEmpty} = crocks
const axTask = Async.fromPromise(axios.get)
const lfTask = Async.fromPromise(localforage.getItem)
const loadChars = (setter) => axTask('https://swapi-json-server-ddpsgpqivc.now.sh/people?_limit=20')
  .map(compose(setter, charactersLoaded, prop('data')))

const charactersLoaded = curry((people, state, props) => ({people: people, isLoading: false}))
const chooseCharacter = curry((char, state, props) => isEmpty(char) ? state : ({chosenChar: char}))

export default class FishWars extends Component {
  state = {
    isLoading: true,
    chosenChar: {},
    people: []
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    // This...
    loadChars(setState)
      .chain(() => lfTask('character'))
      .map(ifElse(isNil, () => Async.rejected('some default'), identity))
      .map(compose(setState, chooseCharacter, JSON.parse))
      .coalesce(() => 'Error', () => 'Success') // Determine if real error, or known error from call to reject
      .fork(console.error, console.log)

    // ... replaces this :)
    // axios.get('https://swapi-json-server-ddpsgpqivc.now.sh/people?_limit=20')
    //   .then(compose(charactersLoaded, prop('data')))
    //   .then(setState)
    //   // It would be ideal to branch here and NoOp if localforage returns nothing
    //   .then(() => localforage.getItem('character')) // invoker?
    //   .then(p => JSON.parse(p)) // use invoker and a tryCatch composed
    //   .then(chooseCharacter)
    //   .then(setState)



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
