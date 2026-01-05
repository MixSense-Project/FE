import { Routes, Route, Navigate } from "react-router-dom";
import Splash from './page/Splash/Splash'
import Home from "./page/Home/Home";
import Ai_Search from "./page/Ai_Search/Ai_Search";
import Ai_Dj from "./page/Ai_Dj/Ai_Dj";
import Library from "./page/Library/Library";
import Mypage from "./page/Mypage/Mypage";
import LibraryLikedSongs from "./page/Library/Library_likedsongs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ai_search" element={<Ai_Search />} />
      <Route path="/ai_dj" element={<Ai_Dj />} />
      <Route path="/library" element={<Library />} />
      <Route path="/library/liked" element={<LibraryLikedSongs />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}

export default App;