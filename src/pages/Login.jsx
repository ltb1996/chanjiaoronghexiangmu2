import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模拟登录验证
    setTimeout(() => {
      // 先从模拟数据中查找
      let user = mockUsers.find(u => 
        u.username === formData.username && 
        u.password === formData.password
      );

      // 如果没找到，再从注册用户中查找
      if (!user) {
        const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
        user = registeredUsers.find(u => 
          u.username === formData.username && 
          u.password === formData.password
        );
      }

      if (user) {
        // 登录成功
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          level: user.level
        };
        
        onLogin(userData);
        setLoading(false);
        navigate('/');
      } else {
        setError('用户名或密码错误');
        setLoading(false);
      }
    }, 1000);
  };

  // 快速登录按钮（演示用）
  const quickLogin = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>登录账户</h2>
          <p>欢迎回到金融学习社区</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading"></span>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className="quick-login">
          <p>快速登录（演示用）：</p>
          <div className="quick-login-buttons">
            <button 
              type="button"
              onClick={() => quickLogin('student01', '123456')}
              className="btn btn-secondary"
            >
              学生账户
            </button>
            <button 
              type="button"
              onClick={() => quickLogin('teacher01', '123456')}
              className="btn btn-secondary"
            >
              教师账户
            </button>
            <button 
              type="button"
              onClick={() => quickLogin('admin', '123456')}
              className="btn btn-secondary"
            >
              管理员
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>还没有账户？<Link to="/register">立即注册</Link></p>
          <p><Link to="/">返回首页</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;