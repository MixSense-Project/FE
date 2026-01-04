import { Routes, Route, Navigate } from "react-router-dom";
import Splash from './components/Splash'
import Home from "./components/home/Home";
import AiSearch from "./components/ai_search/AiSearch";
import Aidj from "./components/ai_dj/Aidj";
import Library from "./components/library/Library";
function App() {
  return (
    <Routes>
      <Route path="/splash" element={<Splash/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/ai_search" element={<AiSearch/>}/>
      <Route path="/ai_dj" element={<Aidj/>}/>
      <Route path="/library" element={<Library/>}/>
    </Routes>
  );
}

export default App;