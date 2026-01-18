import { Routes, Route, Navigate } from "react-router-dom";
{/* Splash */}
import Splash from './page/Splash/Splash'

{/* Home */}
import Home from "./page/Home/Home";
import Home_search from "./page/Home/Home_search";
import Home_trending_now from "./page/Home/Home_trending_now";

{/* Ai search */}
import Ai_Search from "./page/Ai_Search/Ai_Search";
import Ai_Search_Onboarding from "./page/Ai_Search/Ai_Search_Onboarding";

{/* Ai Dj */}
import Ai_Dj from "./page/Ai_Dj/Ai_Dj";
import Ai_Dj_Onboarding from "./page/Ai_Dj/Ai_Dj_Onboarding";
import Ai_Dj_Trackselect from "./page/Ai_Dj/Ai_Dj_Trackselect";
import Ai_Dj_Loading from './page/Ai_Dj/Ai_Dj_Loading'
import Ai_Dj_Result from "./page/Ai_Dj/Ai_Dj_Result";

{/* Library */}
import Library from "./page/Library/Library";
import LibraryLikedSongs from "./page/Library/Library_likedsongs";
import Library_playlist from "./page/Library/Library_playlist";
import Library_addplaylist from "./page/Library/Library_addplaylist";

{/* MyPage */}
import Mypage from "./page/Home/Mypage";

{/* Music */}
import Music_songplay from "./page/Music/Music_songplay";
import Music_songlyrics from "./page/Music/Music_songlyrics";


function App() {
  return (
    <Routes>
      {/* Splash */}
      <Route path="/" element={<Splash />} />

      {/* Home */}
      <Route path="/home" element={<Home />} />
      <Route path="/home_search" element={<Home_search />} />
      <Route path="/home_trending_now" element={<Home_trending_now />} />

      {/* Ai search */}
      <Route path="/ai_search" element={<Ai_Search />} />
      <Route path="/ai_search_onboarding" element={<Ai_Search_Onboarding />} />

      {/* Ai Dj */}
      <Route path="/ai_dj" element={<Ai_Dj />} />
      <Route path="/ai_dj_onboarding" element={<Ai_Dj_Onboarding />} />
      <Route path="/ai_dj_trackselect" element={<Ai_Dj_Trackselect/>}/>
      <Route path="/ai_dj_loading" element={<Ai_Dj_Loading/>}/>
      <Route path="/ai_dj_result" element={<Ai_Dj_Result/>}/>
      
      {/* Library */}
      <Route path="/library" element={<Library />} />
      <Route path="/library/playlist" element={<Library_playlist/>} />
      <Route path="/library/add/playlist" element={<Library_addplaylist/>} />
      <Route path="/library/liked" element={<LibraryLikedSongs />} />

      {/* Music */}
      <Route path="/music/songplay" element={<Music_songplay/>} />
      <Route path="/music/songlyrics" element={<Music_songlyrics/>} />

      {/* MyPage */}
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}

export default App;