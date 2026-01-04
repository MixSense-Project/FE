import { Routes, Route, Navigate } from "react-router-dom";
import Splash from './components/Splash'
import Home from "./components/Home/Home";
import Ai_Search from "./components/Ai_Search/Ai_Search";
import Ai_Dj from "./components/Ai_Dj/Ai_Dj";
import Library from "./components/Library/Library";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/ai_search" element={<Ai_Search/>}/>
      <Route path="/ai_dj" element={<Ai_Dj/>}/>
      <Route path="/library" element={<Library/>}/>
    </Routes>
  );
}

export default App;