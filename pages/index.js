import React, {Component} from 'react'
import Link from 'next/link'
import { bind, curry, curryN, prop, compose, identity, useWith } from 'ramda'
import crocks from 'crocks'
import axios from 'axios'
import localforage from 'localforage'
import CharacterView from '../components/CharacterView'

const {Async, ifElse, isNil, tap, isEmpty, liftA2} = crocks

const axTask = Async.fromPromise(axios.get)
const lfGetTask = Async.fromPromise(localforage.getItem)
const lfSetTask = curryN(2, Async.fromPromise(localforage.setItem))

const createState = curry((people, savedPerson) => ({people: people, isLoading: false, chosenChar: savedPerson}))
const handleState = useWith(createState, [prop('data'), JSON.parse])

const chooseCharacter = curry((char, state, props) => isEmpty(char) ? state : ({chosenChar: char}))

export default class FishWars extends Component {
  state = {
    isLoading: true,
    chosenChar: {},
    people: []
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    Async.of('https://swapi-json-server-ddpsgpqivc.now.sh/people?_limit=20')
      .chain(url => liftA2(handleState, axTask(url), lfGetTask('character')))
      .fork(console.error, setState)
  }

  handleCharSelect = curry((character, evt) => {
    // Not thrilled with the extra setState def, or the JSON parse -> stringify -> parse
    // TODO: Figure out a better way to deal with the 2 required formats here
    const setState = bind(this.setState, this)
    const saveChar = compose(lfSetTask('character'), JSON.stringify)
    saveChar(character)
      .fork(console.error, compose(setState, chooseCharacter, JSON.parse))
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
