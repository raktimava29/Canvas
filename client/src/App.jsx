import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./components/Home/Home'));
const Login = lazy(() => import('./components/Home/Login'));
const Signup = lazy(() => import('./components/Home/Signup'));
const SearchUser = lazy(() => import('./components/Misc/SearchUser'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:id" element={<SearchUser />} />
      </Routes>
    </Suspense>
  );
}

export default App;