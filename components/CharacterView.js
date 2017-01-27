import React from 'react'

export default ({handleCharSelect, name, id, image, selectedChar}) => {
  const style = selectedChar && selectedChar.id === id ? {border:'solid 1px blue'} : {}
  return (
    <li style={style} onClick={handleCharSelect}>{name} <img src={`https://swapi-json-server-ddpsgpqivc.now.sh/${image}`}/></li>
  )
}
