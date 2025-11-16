import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/pic2.png';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/courses', icon: '📚', label: '课程学习' },
    { path: '/community', icon: '💬', label: '交流社区' },
    { path: '/dashboard', icon: '📊', label: '学习仪表板' },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/">
          <img src={logoImage} alt="Logo" className="logo-icon" />
          <span className="logo-text">金融学习社区</span>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 用户区域 */}
      <div className="sidebar-user">
        {currentUser ? (
          <>
            <Link to="/profile" className="user-profile">
              <img src={currentUser.avatar} alt={currentUser.username} className="user-avatar" />
              <div className="user-details">
                <span className="user-name">{currentUser.username}</span>
                <span className="user-role">{currentUser.level}</span>
              </div>
            </Link>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('currentUser');
                window.location.reload();
              }}
            >
              <span className="logout-icon">🚪</span>
              <span>退出登录</span>
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn">
              <span className="auth-icon">🔑</span>
              <span>登录</span>
            </Link>
            <Link to="/register" className="auth-btn">
              <span className="auth-icon">✍️</span>
              <span>注册</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
