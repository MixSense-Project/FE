import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
const Library = () => {
  return (
    <div className='library_wrap'>
      <div className="container">
        <Header title={"Library"}/>
      </div>
      <Nav/>
    </div>
  )
}

export default Library
