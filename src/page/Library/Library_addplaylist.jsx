import React from 'react'
import Searchbar from '../../components/Home/Searchbar'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import Musiclist from '../../components/Home/Musiclist'
const Library_addplaylist = () => {
    return (
        <div className='libraryaddplaylist_wrap'>
            <div className="container">
                <Header />
                <div className="lb_add_search">
                    <Searchbar />
                </div>
                <div className="lb_add_main">
                    <Musiclist/>
                    <Musiclist/>
                    <Musiclist/>
                </div>
            </div>
            <Nav />

        </div>
    )
}

export default Library_addplaylist
