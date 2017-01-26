import React, {Component} from 'react'
import { bind, curry, prop } from 'ramda'
import axios from 'axios'

const loadPeople = curry((people, state, props) => ({people: people, isLoading: false}))

export default class App extends Component {
  state = {
    isLoading: true,
    people: []
  }

  componentDidMount() {
    const setState = bind(this.setState, this)
    axios.get('https://swapi-json-server-ddpsgpqivc.now.sh/people')
      .then(prop('data'))
      .then(loadPeople)
      .then(setState)
  }

  render () {
    return (
      <div>
        { this.state.isLoading && <h4>Loading Data</h4>}
        <h1>Fish Wars</h1>
        <em>or, Starfish if you prefer</em>
        <ul>
          {this.state.people.map(p => <li>{p.name}</li>)}
        </ul>
      </div>
    )
  }
}
