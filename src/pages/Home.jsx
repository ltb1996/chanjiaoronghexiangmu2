import React from 'react';
import { Link } from 'react-router-dom';
import { mockCourses, mockPosts } from '../data/mockData';
import './Home.css';

const Home = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <div className="home fade-in">
      {/* 欢迎区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>欢迎来到金融产教融合学习社区</h1>
          <p>连接学术界与产业界，打造专业的金融学习交流平台</p>
          {currentUser ? (
            <div className="welcome-message">
              <h2>欢迎回来，{currentUser.username}！</h2>
              <p>继续您的学习之旅</p>
            </div>
          ) : (
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">立即注册</Link>
              <Link to="/login" className="btn btn-secondary">已有账号</Link>
            </div>
          )}
        </div>
      </section>

      {/* 统计数据 */}
      <section className="stats-section">
        <div className="grid grid-4">
          <div className="stat-card">
            <h3>1,234</h3>
            <p>注册用户</p>
          </div>
          <div className="stat-card">
            <h3>56</h3>
            <p>精品课程</p>
          </div>
          <div className="stat-card">
            <h3>892</h3>
            <p>讨论话题</p>
          </div>
          <div className="stat-card">
            <h3>4.8</h3>
            <p>用户评分</p>
          </div>
        </div>
      </section>

      {/* 热门课程 */}
      <section className="courses-section">
        <h2>热门课程</h2>
        <div className="grid grid-3">
          {mockCourses.slice(0, 3).map(course => (
            <div key={course.id} className="course-card">
              <img src={course.thumbnail} alt={course.title} />
              <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>讲师：{course.instructor}</span>
                  <span>难度：{course.difficulty}</span>
                </div>
                <div className="course-stats">
                  <span>👥 {course.enrolledStudents}人学习</span>
                  <span>⭐ {course.rating}分</span>
                </div>
                <Link to={`/courses`} className="btn btn-primary">开始学习</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 社区动态 */}
      <section className="community-section">
        <h2>社区动态</h2>
        <div className="posts-list">
          {mockPosts.slice(0, 3).map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.authorAvatar} alt={post.author} className="avatar" />
                <div className="post-meta">
                  <h4>{post.author}</h4>
                  <span>{post.publishTime}</span>
                </div>
                <span className="post-category">{post.category}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-actions">
                <span>👍 {post.likes}</span>
                <span>💬 {post.replies}</span>
                <span>👁️ {post.views}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <Link to="/community" className="btn btn-secondary">查看更多</Link>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="features-section">
        <h2>平台特色</h2>
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>系统化学习</h3>
            <p>从基础到进阶，完整的金融知识体系</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>互动交流</h3>
            <p>与同行交流，向专家请教问题</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>数据可视化</h3>
            <p>直观的学习进度和能力评估</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;