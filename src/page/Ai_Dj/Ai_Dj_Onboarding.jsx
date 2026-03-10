import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import bg_circle1 from '../../assets/img/AIDJ/bg_circle1.png'
import bg_circle2 from '../../assets/img/AIDJ/bg_circle2.png'
import gotodj from '../../assets/img/AIDJ/gotodj.svg'

function Ai_Dj_Onboarding() {
    const navigate = useNavigate();

    const handleStart = () => {
        // ✅ 1. 로컬 스토리지에 '봤음' 기록 저장
        localStorage.setItem('hasSeenAiDjOnboarding', 'true');
        
        // ✅ 2. AI DJ 메인으로 이동 (App.js에서 이제 Ai_Dj를 보여줌)
        // 새로고침을 통해 App.js의 hasSeenOnboarding 변수를 다시 읽게 합니다.
        window.location.href = '/ai_dj';
    };

    return (
        <div className='aidjonboarding_wrap'>
            <div className="container">
                <Header />
                <div className="bg_content">
                    <div className="aidj_on_header">
                        <div className="detail">
                            <p className='hp1'>Create <br />
                                your own DJ set</p>
                            <p className="hp2">with AI</p>
                        </div>
                    </div>
                    <main>
                        <p className='p1'>
                            Beyond simple playback,<br />
                            AI Agent guides your mixing journey.
                        </p>
                        <p className='p2'>
                            AI analyzes the song's BPM and beat to suggest <br />
                            natural transitions and tempo changes.
                        </p>
                        <p className="p3">
                            Seamless Flow, AI-Designed Mixing Plans<br />
                            Mix your songs right now
                        </p>
                        <img src={gotodj} alt="" className="gotodj" />
                        
                        {/* ✅ 버튼 클릭 시 handleStart 실행 */}
                        <button className="aidj_btn" onClick={handleStart}>
                            Go to AI DJ
                        </button>
                    </main>
                </div>
                <div className="bg_circle">
                    <img className='bg_circle1' src={bg_circle1} alt="" />
                    <img className='bg_circle2' src={bg_circle2} alt="" />
                </div>
            </div>
            <Nav />
        </div>
    )
}

export default Ai_Dj_Onboarding