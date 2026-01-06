import React from 'react'
import edit_btn from '../../assets/img/library/edit_btn.svg'
const Library_myplaylist = () => {
    return (
        <div className='myplaylist_wrap'>
            <div className="c_pl_left">
                <div className="c_pl_cover"></div>
                <p className="c_pl_name"> Myplaylist</p></div>
            <div className="edit">
                <img src={edit_btn} alt="" />
            </div>
        </div>
    )
}

export default Library_myplaylist
