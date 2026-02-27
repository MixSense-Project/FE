import React from 'react'
import aidj_img from '../../assets/img/Music/aidj.svg'
import share__img from '../../assets/img/Music/share.svg'
import add_img from '../../assets/img/Music/add.svg'
import { Link } from 'react-router-dom'

const Popup = ({onClose}) => {
  return (
    <div className="Popup_Overlay" onClick={onClose}> 
        <div id="Popup_Wrap" onClick={(e) => e.stopPropagation()}>
            <Link to='/ai_dj'>
              <button className="aidj list">
                  <p>Go to AI DJ</p>
                  <img src={aidj_img} alt="ai dj" />
              </button>
            </Link>
            <button className="share list">
                <p>Share</p>
                <img src={share__img} alt="share" />
            </button>
            <button className="add list">
                <p>Add to myplaylist</p>
                <img src={add_img} alt="add" />
            </button>
        </div>
    </div>
  )
}

export default Popup