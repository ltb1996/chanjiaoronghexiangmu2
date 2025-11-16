import React, { useState } from 'react';
import { mockCourses } from '../data/mockData';
import StorageUtil from '../utils/storage';
import './Courses.css';

const Courses = ({ currentUser }) => {
  // 使用函数式初始化，避免在 useEffect 中同步调用 setState
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      return JSON.parse(savedCourses);
    } else {
      localStorage.setItem('courses', JSON.stringify(mockCourses));
      return mockCourses;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(courses.map(course => course.category))];
  const difficulties = ['all', '初级', '中级', '高级'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleEnrollCourse = (courseId) => {
    if (!currentUser) {
      alert('请先登录后再报名课程');
      return;
    }

    // 模拟报名课程
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          enrolledStudents: course.enrolledStudents + 1
        };
      }
      return course;
    });

    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    // 记录学习进度
    StorageUtil.addLearningRecord(currentUser.id, {
      type: 'course_enrolled',
      courseId: courseId,
      courseTitle: courses.find(c => c.id === courseId)?.title
    });

    alert('报名成功！开始学习吧！');
  };

  const getProgress = (courseId) => {
    if (!currentUser) return 0;
    const progress = StorageUtil.getCourseProgress(currentUser.id, courseId);
    return progress ? progress.completedLessons / progress.totalLessons * 100 : 0;
  };

  return (
    <div className="courses-page fade-in">
      <div className="courses-header">
        <h1>课程中心</h1>
        <p>系统化的金融知识学习路径</p>
      </div>

      {/* 筛选和搜索 */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '全部分类' : category}
              </option>
            ))}
          </select>

          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="form-control"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? '全部难度' : difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 课程统计 */}
      <div className="stats-bar">
        <span>共找到 {filteredCourses.length} 门课程</span>
        {currentUser && (
          <span>已学习 {courses.filter(c => getProgress(c.id) > 0).length} 门课程</span>
        )}
      </div>

      {/* 课程列表 */}
      <div className="courses-grid">
        {filteredCourses.map(course => {
          const progress = getProgress(course.id);
          const isEnrolled = currentUser && progress > 0;
          
          return (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.thumbnail} alt={course.title} />
                <div className="course-badge">{course.difficulty}</div>
              </div>
              
              <div className="course-content">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className="course-category">{course.category}</span>
                </div>
                
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-label">讲师：</span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">时长：</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">学员：</span>
                    <span>{course.enrolledStudents}人</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">评分：</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{Math.round(progress)}% 完成</span>
                  </div>
                )}

                <div className="course-actions">
                  {isEnrolled ? (
                    <button className="btn btn-primary continue-btn">
                      继续学习
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEnrollCourse(course.id)}
                      className="btn btn-primary enroll-btn"
                    >
                      立即报名
                    </button>
                  )}
                  <button className="btn btn-secondary preview-btn">
                    课程预览
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">📚</div>
          <h3>没有找到相关课程</h3>
          <p>试试调整筛选条件或搜索关键词</p>
        </div>
      )}
    </div>
  );
};

export default Courses;