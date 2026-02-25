import React from 'react'
import SubHeader from '../../components/SubHeader'
import Searchbar from '../../components/Home/Searchbar'
import Musiclist from '../../components/Home/Musiclist'
import Nav from '../../components/Nav'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const Home_trending_now = () => {

  //Trending Now api 연동
  const [trendingTracks, setTrendingTracks] = useState([]);

  const fetchTrending = async () =>{
    try{
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${BASE_URL}/api/trending`,{
        headers:{"ngrok-skip-browser-warning": "69420"}
    });

    console.log("서버 데이터:", response.data);
    if (response.data && response.data.trending) {
        setTrendingTracks(response.data.trending);
      }
    
    }catch (error){
      console.log(error)
      }
    }

    useEffect(()=>{
      fetchTrending();
    }, []);
  
  return (
    <div className="home_trendging_now">
        <div className="container">
          <SubHeader title="Trending Now"/>
          {/* <Searchbar/> */}
          <div className="scroll_container">

              {trendingTracks.length > 0 ? (
                  trendingTracks.map((item) => (
                    <Musiclist key={item.id} data={item} />
                  ))
              ) : (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading trending...</p>
              )}
          </div>
        </div>
        <Nav/>
    </div>
  )
}

export default Home_trending_now