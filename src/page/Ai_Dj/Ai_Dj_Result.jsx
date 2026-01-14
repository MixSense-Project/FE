import React from 'react'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import graphic from '../../assets/img/AISearch/graphic.png'
const Ai_Dj_Result = () => {
    return (
        <div className='aidjresult_wrap'>
            <div className="container">
                <Header />
                <div className="result_header">
                    <h1>AI mix creation complete!
                    </h1>
                    <p>Enjoy your unique mixing sense.</p>
                </div>

                <div className="result_song">
                    <div className="rs_cover"></div>
                    <div className="rs_right">
                        <p className="p1">Music X Music Remix</p>
                        <p className="p2">3m 32s</p>
                    </div>
                </div>
                <img src={graphic} alt="" className="graphic" />
                <button className="addpl_btn">
                    Add to playlist
                </button>
                <button className="backdj_btn">
                    Back to AI DJ
                </button>
            </div>
            <Nav />
        </div>
    )
}

export default Ai_Dj_Result
