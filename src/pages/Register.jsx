import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // 模拟注册过程
    setTimeout(() => {
      // 创建新用户数据
      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        joinDate: new Date().toISOString().split('T')[0],
        coursesCompleted: 0,
        totalScore: 0,
        level: formData.role === 'student' ? '新学员' : 
               formData.role === 'teacher' ? '讲师' : '管理员'
      };

      // 保存到localStorage（模拟数据库）
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 检查用户名是否已存在
      if (existingUsers.some(u => u.username === formData.username)) {
        setErrors({ username: '用户名已存在' });
        setLoading(false);
        return;
      }

      // 检查邮箱是否已存在
      if (existingUsers.some(u => u.email === formData.email)) {
        setErrors({ email: '邮箱已被注册' });
        setLoading(false);
        return;
      }

      // 添加新用户
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      setLoading(false);
      
      // 显示注册成功提示
      alert('注册成功！请登录您的账户');
      
      // 跳转到登录页面
      navigate('/login');
      
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>注册账户</h2>
          <p>加入金融学习社区</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              placeholder="请输入用户名"
              required
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="请输入邮箱地址"
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="请输入密码（至少6位）"
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">确认密码</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="请再次输入密码"
              required
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">用户类型</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="student">学生</option>
              <option value="teacher">教师</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary register-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading"></span>
            ) : (
              '注册'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>已有账户？<Link to="/login">立即登录</Link></p>
          <p><Link to="/">返回首页</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;