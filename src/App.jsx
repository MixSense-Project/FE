import { Routes, Route, Navigate } from "react-router-dom";
import Splash from './page/Splash/Splash'
import Home from "./page/Home/Home";
import Home_search from "./page/Home/Home_search";
import Home_trending_now from "./page/Home/Home_trending_now";
import Ai_Search from "./page/Ai_Search/Ai_Search";
import Ai_Dj from "./page/Ai_Dj/Ai_Dj";
import Library from "./page/Library/Library";
import Mypage from './page/Home/Mypage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/home_search" element={<Home_search/>}/>
      <Route path="/home_trending_now" element={<Home_trending_now/>}/>
      <Route path="/ai_search" element={<Ai_Search/>}/>
      <Route path="/ai_dj" element={<Ai_Dj/>}/>
      <Route path="/library" element={<Library/>}/>
      <Route path="/mypage" element={<Mypage/>}/>
    </Routes>
  );
}

export default App;