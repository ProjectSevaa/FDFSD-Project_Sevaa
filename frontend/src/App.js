import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserHomePage from './pages/UserHomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/u_login" element={<LoginPage />} />
        <Route path="/u_signup" element={<SignupPage />} />
        <Route path="/user/user_homepage" element={<UserHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
