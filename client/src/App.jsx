import Home from "./components/Home/Home";
import Login from "./components/Home/Login";
import Signup from "./components/Home/Signup";
import SearchUser from "./components/Misc/SearchUser";
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:id" element={<SearchUser />} />
    </Routes>
  )
}

export default App;
