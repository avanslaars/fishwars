import { reducer, initStore } from './store'

export default (ComponentClass) =>
    class extends ComponentClass {
      static getInitialProps ({ req }) {
        const isServer = !!req
        const store = initStore(reducer, null, isServer)
        store.dispatch({ type: 'TICK', light: !isServer, ts: Date.now() })
        return { initialState: store.getState(), isServer }
      }

      constructor (props) {
        super(props)
        this.store = initStore(reducer, props.initialState, props.isServer)
      }
    }
