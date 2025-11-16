import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const menuItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/courses', icon: '📚', label: '课程学习' },
    { path: '/community', icon: '💬', label: '交流社区' },
    { path: '/dashboard', icon: '📊', label: '学习仪表板' },
  ];

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* 切换按钮 */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <span className="toggle-icon">{isExpanded ? '◀' : '▶'}</span>
      </button>

      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/">
          <span className="logo-icon">💰</span>
          {isExpanded && <span className="logo-text">金融学习社区</span>}
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            title={!isExpanded ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {isExpanded && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* 用户区域 */}
      <div className="sidebar-user">
        {currentUser ? (
          <>
            <Link to="/profile" className="user-profile" title={!isExpanded ? '个人中心' : ''}>
              <img src={currentUser.avatar} alt={currentUser.username} className="user-avatar" />
              {isExpanded && (
                <div className="user-details">
                  <span className="user-name">{currentUser.username}</span>
                  <span className="user-role">{currentUser.level}</span>
                </div>
              )}
            </Link>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('currentUser');
                window.location.reload();
              }}
              title={!isExpanded ? '退出登录' : ''}
            >
              <span className="logout-icon">🚪</span>
              {isExpanded && <span>退出登录</span>}
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn" title={!isExpanded ? '登录' : ''}>
              <span className="auth-icon">🔑</span>
              {isExpanded && <span>登录</span>}
            </Link>
            <Link to="/register" className="auth-btn" title={!isExpanded ? '注册' : ''}>
              <span className="auth-icon">✍️</span>
              {isExpanded && <span>注册</span>}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

