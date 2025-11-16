import React from 'react';
import { mockLearningProgress } from '../data/mockData';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="dashboard-page">
        <div className="not-logged-in">
          <h2>请先登录</h2>
          <p>您需要登录才能查看学习仪表板</p>
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

  // 模拟学习数据
  const learningData = [
    { day: '周一', hours: 2.5 },
    { day: '周二', hours: 1.8 },
    { day: '周三', hours: 3.2 },
    { day: '周四', hours: 2.1 },
    { day: '周五', hours: 1.5 },
    { day: '周六', hours: 2.8 },
    { day: '周日', hours: 1.2 }
  ];

  const skillData = [
    { skill: '金融基础', level: 85 },
    { skill: '投资分析', level: 72 },
    { skill: '风险管理', level: 68 },
    { skill: '量化分析', level: 45 },
    { skill: '财务分析', level: 78 }
  ];

  const recentActivities = [
    {
      type: 'course',
      title: '完成《金融市场基础》第3章',
      time: '2小时前',
      icon: '📚'
    },
    {
      type: 'discussion',
      title: '参与"投资组合优化"讨论',
      time: '5小时前',
      icon: '💬'
    },
    {
      type: 'achievement',
      title: '获得"连续学习7天"成就',
      time: '1天前',
      icon: '🏆'
    },
    {
      type: 'test',
      title: '通过《风险管理》测试',
      time: '2天前',
      icon: '📝'
    }
  ];

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-header">
        <h1>学习仪表板</h1>
        <p>欢迎回来，{currentUser.username}！继续您的学习之旅</p>
      </div>

      {/* 概览统计 */}
      <div className="overview-stats">
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
            <p>已完成</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{userProgress.completedHours}</h3>
            <p>学习时长(小时)</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{userProgress.currentStreak}</h3>
            <p>连续天数</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* 左侧：学习进度 */}
        <div className="left-panel">
          {/* 本周学习进度 */}
          <div className="progress-chart card">
            <h3>本周学习进度</h3>
            <div className="chart-container">
              {learningData.map((data, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-fill" style={{height: `${(data.hours / 4) * 100}%`}}></div>
                  <span className="bar-label">{data.day}</span>
                  <span className="bar-value">{data.hours}h</span>
                </div>
              ))}
            </div>
            <div className="chart-summary">
              <p>本周总计：<strong>{learningData.reduce((sum, data) => sum + data.hours, 0)}小时</strong></p>
              <p>目标完成度：<strong>{((learningData.reduce((sum, data) => sum + data.hours, 0) / userProgress.weeklyGoal) * 100).toFixed(1)}%</strong></p>
            </div>
          </div>

          {/* 技能雷达图 */}
          <div className="skills-radar card">
            <h3>技能评估</h3>
            <div className="skills-list">
              {skillData.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.skill}</span>
                    <span className="skill-level">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{width: `${skill.level}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：最近活动 */}
        <div className="right-panel">
          {/* 最近活动 */}
          <div className="recent-activities card">
            <h3>最近活动</h3>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 学习目标 */}
          <div className="learning-goals card">
            <h3>本周学习目标</h3>
            <div className="goal-item">
              <div className="goal-header">
                <span>完成《投资组合管理》课程</span>
                <span className="goal-progress">75%</span>
              </div>
              <div className="goal-bar">
                <div className="goal-fill" style={{width: '75%'}}></div>
              </div>
            </div>
            
            <div className="goal-item">
              <div className="goal-header">
                <span>参与3次社区讨论</span>
                <span className="goal-progress">2/3</span>
              </div>
              <div className="goal-bar">
                <div className="goal-fill" style={{width: '66%'}}></div>
              </div>
            </div>
            
            <div className="goal-item">
              <div className="goal-header">
                <span>学习时长达到10小时</span>
                <span className="goal-progress">{userProgress.weeklyProgress}/{userProgress.weeklyGoal}</span>
              </div>
              <div className="goal-bar">
                <div className="goal-fill" style={{width: `${(userProgress.weeklyProgress / userProgress.weeklyGoal) * 100}%`}}></div>
              </div>
            </div>
          </div>

          {/* 推荐课程 */}
          <div className="recommended-courses card">
            <h3>推荐课程</h3>
            <div className="course-recommendations">
              <div className="recommended-course">
                <h4>高级投资组合优化</h4>
                <p>深入学习现代投资组合理论</p>
                <span className="course-match">匹配度: 92%</span>
              </div>
              <div className="recommended-course">
                <h4>金融衍生品定价</h4>
                <p>掌握期权、期货定价模型</p>
                <span className="course-match">匹配度: 85%</span>
              </div>
              <div className="recommended-course">
                <h4>行为金融学</h4>
                <p>理解投资者心理和市场行为</p>
                <span className="course-match">匹配度: 78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;