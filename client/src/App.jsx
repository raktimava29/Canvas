import Home from "./components/Home/Home";
import Login from "./components/Home/Login";
import Signup from "./components/Home/Signup";
import Login1 from "./components/Home/Login1";
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/google-login" element={<Login1 />} />
    </Routes>
  )
}

export default App;
