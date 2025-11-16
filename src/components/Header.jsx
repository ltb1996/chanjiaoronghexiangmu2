import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>金融学习社区</h1>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            首页
          </Link>
          <Link to="/courses" className={isActive('/courses') ? 'active' : ''}>
            课程学习
          </Link>
          <Link to="/community" className={isActive('/community') ? 'active' : ''}>
            交流社区
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            学习仪表板
          </Link>
        </nav>

        <div className="user-section">
          {currentUser ? (
            <div className="user-info">
              <span>欢迎，{currentUser.username}</span>
              <Link to="/profile">个人中心</Link>
              <button onClick={() => {
                localStorage.removeItem('currentUser');
                window.location.reload();
              }}>退出</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;