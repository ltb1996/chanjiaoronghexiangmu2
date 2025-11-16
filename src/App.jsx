import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LiquidEther from './LiquidEther';
import './App.css';

function App() {
  // 使用函数初始化状态，避免每次渲染都读取localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // 可以添加其他清理逻辑
  };

  return (
    <div className="App">
      {/* 流体动画背景 */}
      <div className="liquid-background" style={{ width: '100%', height: '100%', position: 'fixed' }}>
        <LiquidEther
          colors={['#00d4ff', '#00b4d8', '#0096c7', '#ff6b35']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          dt={0.014}
          BFECC={true}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      {/* 主要内容 */}
      <div className="app-content">
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses currentUser={currentUser} />} />
            <Route path="/community" element={<Community currentUser={currentUser} />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;