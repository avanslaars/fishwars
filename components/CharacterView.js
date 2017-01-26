import React from 'react'

export default ({handleCharSelect, name, id, image}) => {
  return (
    <li onClick={handleCharSelect(id)}>{name} <img src={`https://swapi-json-server-ddpsgpqivc.now.sh/${image}`}/></li>
  )
}
