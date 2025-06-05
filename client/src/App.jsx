import Home from "./components/Home/Home";
import Login from "./components/Home/Login";
import Signup from "./components/Home/Signup";
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App;
