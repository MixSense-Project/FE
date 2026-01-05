import React from 'react'
import searchicon from '../assets/img/Nav/search_g.svg'

const Searchbar = () => {
  return (
    <div id='Searchbar_Wrap'>
      <img src={searchicon} alt="Search Icon" />
      <input type="text" placeholder="Search" />
    </div>
  )
}

export default Searchbar