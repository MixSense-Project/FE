import React from 'react'
import searchicon from '../../assets/img/Nav/search_g.svg'

const Searchbar = () => {
  return (
    <div id='Searchbar_Wrap'>
      <div className="searchbar">
        <div className="searchbar_content">
          <img src={searchicon} alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  )
}

export default Searchbar