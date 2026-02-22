import React from 'react'
import Nav from '../../components/Nav'
import SubHeader from '../../components/SubHeader'
import Searchbar from '../../components/Home/Searchbar'
import Musiclist from '../../components/Home/Musiclist'

const Ai_Dj_Trackselect = () => {
  return (
    <div id="Ai_Dj_Trackselect">
        <div className="container">
            <SubHeader title={"Track Select"}/>
            <Searchbar/>
            <div className="scroll_container">
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
                <Musiclist/>
            </div>
        </div>
        <Nav/>
    </div> 
  )
}

export default Ai_Dj_Trackselect