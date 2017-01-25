import React from 'react'
import { Provider } from 'react-redux'
import { startClock } from '../store'
import Page from '../components/Page'
import initRedux from '../redux-decorator'


@initRedux
export default class Counter extends React.Component {
  componentDidMount () {
    this.timer = this.store.dispatch(startClock())
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    return (
      <Provider store={this.store}>
        <Page title='Index Page' linkTo='/other' />
      </Provider>
    )
  }
}
