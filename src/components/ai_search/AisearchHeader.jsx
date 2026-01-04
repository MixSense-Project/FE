import React from 'react'
import '../../assets/sass/section/header.scss'
import back_btn from '../../assets/img/ai_search/back_btn.svg'
const AisearchHeader = () => {
    return (
        <div className='header_wrap'>
            <button className="back_btn">
                <img src={back_btn} alt="" />
            </button>
            <h1>AI Search</h1>
        </div>
    )
}

export default AisearchHeader
