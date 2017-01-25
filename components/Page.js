import Link from 'next/link'
import { connect } from 'react-redux'
import Clock from './Clock'
import {compose, identity, unary} from 'ramda'

const output = ({ title, linkTo, lastUpdate, light }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Clock lastUpdate={lastUpdate} light={light} />
      <nav>
        <Link href={linkTo}><a>Navigate</a></Link>
      </nav>
    </div>
  )
}

const comp = connect(identity)(output)

export default comp
