import React from 'react'
import searchicon from '../../assets/img/nav/search_g.svg'

// props(value, onChange)를 받아오도록 수정
const Searchbar = ({ value, onChange }) => {
  return (
    <div id='Searchbar_Wrap'>
      <div className="searchbar">
        <div className="searchbar_content">
          <img src={searchicon} alt="Search Icon" />
          <input 
            type="text" 
            placeholder="Search" 
            value={value}         // 부모의 상태값 연결
            onChange={onChange}   // 값이 바뀔 때 부모 함수 실행
          />
        </div>
      </div>
    </div>
  )
}

export default Searchbar