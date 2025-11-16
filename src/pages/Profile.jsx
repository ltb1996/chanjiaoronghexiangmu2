import React from 'react';
import { mockLearningProgress } from '../data/mockData';
import './Profile.css';

const Profile = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="not-logged-in">
          <h2>请先登录</h2>
          <p>您需要登录才能查看个人中心</p>
        </div>
      </div>
    );
  }

  const userProgress = mockLearningProgress[currentUser.username] || {
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    completedHours: 0,
    achievements: [],
    currentStreak: 0,
    weeklyGoal: 10,
    weeklyProgress: 0
  };

  const completionRate = userProgress.totalCourses > 0 ? 
    (userProgress.completedCourses / userProgress.totalCourses * 100).toFixed(1) : 0;

  const weeklyProgressPercent = (userProgress.weeklyProgress / userProgress.weeklyGoal * 100).toFixed(1);

  return (
    <div className="profile-page fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={currentUser.avatar} alt={currentUser.username} />
        </div>
        <div className="profile-info">
          <h1>{currentUser.username}</h1>
          <p className="profile-role">{currentUser.level}</p>
          <p className="profile-email">{currentUser.email}</p>
          <p className="profile-join-date">加入时间：{currentUser.joinDate}</p>
        </div>
      </div>

      <div className="profile-content">
        {/* 学习统计 */}
        <div className="stats-section">
          <h2>学习统计</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>{userProgress.totalCourses}</h3>
                <p>总课程数</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{userProgress.completedCourses}</h3>
                <p>已完成课程</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <h3>{userProgress.totalHours}</h3>
                <p>总学习时长(小时)</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3>{completionRate}%</h3>
                <p>完成率</p>
              </div>
            </div>
          </div>
        </div>

        {/* 学习进度 */}
        <div className="progress-section">
          <h2>学习进度</h2>
          <div className="progress-cards">
            <div className="progress-card">
              <h3>本周学习进度</h3>
              <div className="progress-circle">
                <div className="circle-progress" style={{
                  background: `conic-gradient(#667eea 0deg, #667eea ${weeklyProgressPercent * 3.6}deg, #e9ecef ${weeklyProgressPercent * 3.6}deg, #e9ecef 360deg)`
                }}>
                  <div className="circle-inner">
                    <span className="progress-percent">{weeklyProgressPercent}%</span>
                    <span className="progress-text">{userProgress.weeklyProgress}/{userProgress.weeklyGoal}小时</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="progress-card">
              <h3>连续学习天数</h3>
              <div className="streak-display">
                <div className="streak-number">{userProgress.currentStreak}</div>
                <div className="streak-text">天</div>
              </div>
              <p className="streak-desc">继续保持！</p>
            </div>
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="achievements-section">
          <h2>我的成就</h2>
          <div className="achievements-grid">
            {userProgress.achievements.length > 0 ? (
              userProgress.achievements.map((achievement, index) => (
                <div key={index} className="achievement-card earned">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-info">
                    <h4>{achievement}</h4>
                    <p>已获得</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-achievements">
                <p>还没有获得成就，继续学习吧！</p>
              </div>
            )}
          </div>
        </div>

        {/* 账户设置 */}
        <div className="settings-section">
          <h2>账户设置</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>修改密码</h4>
                <p>更新您的登录密码</p>
              </div>
              <button className="btn btn-secondary">修改</button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>通知设置</h4>
                <p>管理邮件和应用通知</p>
              </div>
              <button className="btn btn-secondary">设置</button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>隐私设置</h4>
                <p>控制您的个人信息可见性</p>
              </div>
              <button className="btn btn-secondary">设置</button>
            </div>
          </div>
        </div>

        {/* 学习记录 */}
        <div className="learning-records-section">
          <h2>最近学习记录</h2>
          <div className="records-list">
            <div className="record-item">
              <div className="record-icon">📖</div>
              <div className="record-content">
                <h4>完成《金融市场基础》第3章</h4>
                <p>2024年1月20日 14:30</p>
              </div>
            </div>
            <div className="record-item">
              <div className="record-icon">📝</div>
              <div className="record-content">
                <h4>参与社区讨论</h4>
                <p>2024年1月19日 16:45</p>
              </div>
            </div>
            <div className="record-item">
              <div className="record-icon">🏆</div>
              <div className="record-content">
                <h4>获得"初学者"成就</h4>
                <p>2024年1月18日 09:20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;