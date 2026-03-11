import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // Navigate 추가
import { MusicProvider } from "./context/MusicContext";

// 공통 컴포넌트
import Musicplay from "./components/Home/Musicplay";
import YouTubePlayer from "./components/YouTubePlayer";
import Nav from "./components/Nav";

// 페이지 컴포넌트 임포트
import Splash from './page/Splash/Splash'
import Splash_account from "./page/Splash/Splash_account";
import Splash_Login from "./page/Splash/Splash_Login";
import Splash_Signup from "./page/Splash/Splash_Signup";
import Home from "./page/Home/Home";
import Home_search from "./page/Home/Home_search";
import Home_trending_now from "./page/Home/Home_trending_now";
import Ai_Search from "./page/Ai_Search/Ai_Search";
import Ai_Dj from "./page/Ai_Dj/Ai_Dj";
import Ai_Dj_Onboarding from "./page/Ai_Dj/Ai_Dj_Onboarding";
import Ai_Dj_Trackselect from "./page/Ai_Dj/Ai_Dj_Trackselect";
import Ai_Dj_Loading from './page/Ai_Dj/Ai_Dj_Loading'
import Ai_Dj_Result from "./page/Ai_Dj/Ai_Dj_Result";
import Library from "./page/Library/Library";
import LibraryLikedSongs from "./page/Library/Library_likedsongs";
import Library_playlist from "./page/Library/Library_playlist";
import Library_addplaylist from "./page/Library/Library_addplaylist";
import Mypage from "./page/Home/Mypage";
import Music_songplay from "./page/Music/Music_songplay";
import Music_songlyrics from "./page/Music/Music_songlyrics";
import Preference_genre from "./page/Preference/Preference_genre";
import Preference_artist from "./page/Preference/Preference_artist";
import Preference_artist_search from "./page/Preference/Preference_artist_search";

function App() {
  const location = useLocation();

  // ✅ 온보딩 완료 여부 확인 함수
  const hasSeenOnboarding = localStorage.getItem('hasSeenAiDjOnboarding') === 'true';

  const hideBottomBar = [
    "/", "/splash_account", "/splash_login", "/splash_signup",
    "/ai_dj_loading", "/preference_genre", "/preference_artist",
    "/preference_artist_search", "/ai_search",
    "/ai_dj", "/ai_dj_trackselect", "/ai_dj_loading", "/ai_dj_onboarding", "/ai_dj_result",
    "/music/songplay", "/music/songlyrics"
  ].includes(location.pathname);

  return (
    <MusicProvider>
      <div className="app_container">
        <YouTubePlayer />

        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/splash_account" element={<Splash_account />} />
          <Route path="/splash_login" element={<Splash_Login />} />
          <Route path="/splash_signup" element={<Splash_Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home_search" element={<Home_search />} />
          <Route path="/home_trending_now" element={<Home_trending_now />} />
          <Route path="/ai_search" element={<Ai_Search />} />

          {/* ✅ AI DJ 진입 로직 수정 */}
          <Route 
            path="/ai_dj" 
            element={hasSeenOnboarding ? <Ai_Dj /> : <Navigate to="/ai_dj_onboarding" replace />} 
          />
          <Route path="/ai_dj_onboarding" element={<Ai_Dj_Onboarding />} />
          <Route path="/ai_dj_trackselect" element={<Ai_Dj_Trackselect/>}/>
          <Route path="/ai_dj_loading" element={<Ai_Dj_Loading/>}/>
          <Route path="/ai_dj_result" element={<Ai_Dj_Result/>}/>
          
          <Route path="/library" element={<Library />} />
          <Route path="/library/playlist" element={<Library_playlist/>} />
          <Route path="/library/add/playlist" element={<Library_addplaylist/>} />
          <Route path="/library/liked" element={<LibraryLikedSongs />} />
          <Route path="/music/songplay" element={<Music_songplay/>} />
          <Route path="/music/songlyrics" element={<Music_songlyrics/>} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/preference_genre" element={<Preference_genre/>} />
          <Route path="/preference_artist" element={<Preference_artist/>}/>
          <Route path="/preference_artist_search" element={<Preference_artist_search/>}/>
        </Routes>

        {!hideBottomBar && <Musicplay />}
      </div>
    </MusicProvider>
  );
}

export default App;