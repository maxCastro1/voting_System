import './App.css';
import Header from './components/header/Header';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Home from './pages/home/home';
import Nopage from './pages/nopage/Nopage';

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/landingPage';

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(true);
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<Home user={user}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </>
  );
}

export default App;