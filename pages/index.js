import React, {Component} from 'react'
import { curry } from 'ramda'
import 'isomorphic-fetch'

const loadPeople = (people) => (state, props) => ({people: people, isLoading: false})

export default class App extends Component {
  state = {
    isLoading: true,
    people: []
  }

  componentDidMount() {
    // Works
    // fetch('https://swapi-json-server-ddpsgpqivc.now.sh/people')
    //   .then(res => res.json())
    //   .then(p => loadPeople(p))
    //   .then(fn => this.setState(fn))

    //Works
    fetch('https://swapi-json-server-ddpsgpqivc.now.sh/people')
      .then(res => res.json())
      .then(loadPeople)
      .then(fn => this.setState(fn))

    //Doesn't work - using this.setState without wrapping it in a fn
    // fetch('https://swapi-json-server-ddpsgpqivc.now.sh/people')
    //   .then(res => res.json())
    //   .then(loadPeople)
    //   .then(this.setState)
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
