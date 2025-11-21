import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../data/mockData';
import StorageUtil from '../utils/storage';
import './CourseDetail.css';

const CourseDetail = ({ currentUser }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // 使用函数式初始化避免在effect中同步调用setState
  const [course] = useState(() => {
    return mockCourses.find(c => c.id === parseInt(courseId));
  });

  const [currentLesson, setCurrentLesson] = useState(() => {
    return course?.lessons[0] || null;
  });

  const [progress, setProgress] = useState(() => {
    if (!currentUser || !course) return null;
    
    const savedProgress = StorageUtil.getCourseProgress(currentUser.id, parseInt(courseId));
    if (savedProgress) {
      return savedProgress;
    } else {
      const initialProgress = {
        courseId: parseInt(courseId),
        completedLessons: 0,
        totalLessons: course.lessons.length,
        currentLessonId: course.lessons[0].id,
        lastStudyTime: new Date().toISOString()
      };
      StorageUtil.setCourseProgress(currentUser.id, parseInt(courseId), initialProgress);
      return initialProgress;
    }
  });

  const [comments, setComments] = useState(() => {
    return course ? StorageUtil.getCourseComments(parseInt(courseId)) : [];
  });

  // 视频控制函数
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && currentLesson) {
      // 重置视频状态
      video.load();
      video.pause();
    }
  }, [currentLesson]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    // 自动播放下一课
    const lessonIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (lessonIndex < course.lessons.length - 1) {
      handleLessonClick(course.lessons[lessonIndex + 1]);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (currentUser && progress) {
      const updatedProgress = {
        ...progress,
        currentLessonId: lesson.id,
        lastStudyTime: new Date().toISOString()
      };
      setProgress(updatedProgress);
      StorageUtil.setCourseProgress(currentUser.id, parseInt(courseId), updatedProgress);
    }
  };

  const handleCompleteLesson = () => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    const lessonIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    const updatedLessons = [...course.lessons];
    updatedLessons[lessonIndex].completed = true;

    const completedCount = updatedLessons.filter(l => l.completed).length;
    const updatedProgress = {
      ...progress,
      completedLessons: completedCount,
      lastStudyTime: new Date().toISOString()
    };

    setProgress(updatedProgress);
    StorageUtil.setCourseProgress(currentUser.id, parseInt(courseId), updatedProgress);

    // 记录学习行为
    StorageUtil.addLearningRecord(currentUser.id, {
      type: 'lesson_completed',
      courseId: parseInt(courseId),
      courseTitle: course.title,
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title
    });

    // 如果还有下一课，自动跳转
    if (lessonIndex < course.lessons.length - 1) {
      setCurrentLesson(updatedLessons[lessonIndex + 1]);
    } else {
      alert('恭喜！您已完成本课程所有章节！');
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('请先登录后再评论');
      return;
    }

    if (!newComment.trim()) {
      alert('评论内容不能为空');
      return;
    }

    const comment = {
      content: newComment,
      author: currentUser.username,
      authorAvatar: currentUser.avatar,
      rating: userRating
    };

    const savedComment = StorageUtil.addCourseComment(parseInt(courseId), comment);
    setComments([savedComment, ...comments]);
    setNewComment('');
    setUserRating(0);
  };

  const handleRating = (rating) => {
    setUserRating(rating);
  };

  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  const progressPercent = progress ? (progress.completedLessons / progress.totalLessons * 100).toFixed(1) : 0;

  return (
    <div className="course-detail-page fade-in">
      {/* 返回按钮 */}
      <div className="back-navigation">
        <button onClick={() => navigate('/courses')} className="back-btn">
          ← 返回课程列表
        </button>
      </div>

      {/* 课程头部信息 */}
      <div className="course-detail-header">
        <div className="course-header-content">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-meta-info">
            <span className="meta-item">👨‍🏫 {course.instructor}</span>
            <span className="meta-item">⏱️ {course.duration}</span>
            <span className="meta-item">📊 {course.difficulty}</span>
            <span className="meta-item">⭐ {course.rating} 分</span>
            <span className="meta-item">👥 {course.enrolledStudents} 人学习</span>
          </div>
          {progress && (
            <div className="course-progress-bar">
              <div className="progress-info">
                <span>学习进度</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="progress-stats">
                已完成 {progress.completedLessons} / {progress.totalLessons} 课时
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="course-detail-content">
        {/* 左侧：视频播放区 */}
        <div className="video-section">
          <div className="video-player">
            {currentLesson?.videoUrl ? (
              <video
                ref={videoRef}
                className="video-element"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                onClick={togglePlay}
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            ) : (
              <div className="video-placeholder">
                <p>暂无视频</p>
              </div>
            )}
            {!isPlaying && currentLesson?.videoUrl && (
              <button 
                className="play-button-overlay"
                onClick={togglePlay}
              >
                ▶️
              </button>
            )}
          </div>

          {/* 视频控制栏 */}
          <div className="video-controls">
            <div className="control-left">
              <button 
                className="control-btn"
                onClick={togglePlay}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <span className="video-duration">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="control-right">
              <select 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="speed-control"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
              <button className="control-btn" onClick={toggleMute}>
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button className="control-btn" onClick={toggleFullscreen}>
                ⛶
              </button>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="video-progress-bar">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                setCurrentTime(time);
                if (videoRef.current) {
                  videoRef.current.currentTime = time;
                }
              }}
              className="progress-slider"
            />
          </div>

          {/* 当前课程信息 */}
          <div className="current-lesson-info">
            <h2>{currentLesson?.title}</h2>
            <div className="lesson-actions">
              <button 
                className="btn btn-primary"
                onClick={handleCompleteLesson}
                disabled={!currentUser}
              >
                ✓ 标记为已完成
              </button>
              <button className="btn btn-secondary">
                📥 下载课件
              </button>
              <button className="btn btn-secondary">
                📝 记笔记
              </button>
            </div>
          </div>

          {/* 课程介绍标签页 */}
          <div className="course-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${!showComments ? 'active' : ''}`}
                onClick={() => setShowComments(false)}
              >
                课程介绍
              </button>
              <button 
                className={`tab-btn ${showComments ? 'active' : ''}`}
                onClick={() => setShowComments(true)}
              >
                评论 ({comments.length})
              </button>
            </div>

            <div className="tabs-content">
              {!showComments ? (
                <div className="course-intro">
                  <h3>课程简介</h3>
                  <p>{course.description}</p>
                  
                  <h3>你将学到</h3>
                  <ul className="learning-points">
                    <li>✓ 掌握{course.category}的核心概念</li>
                    <li>✓ 理解{course.title}的实际应用</li>
                    <li>✓ 提升金融分析和决策能力</li>
                    <li>✓ 获得行业认可的学习证书</li>
                  </ul>

                  <h3>适合人群</h3>
                  <ul className="target-audience">
                    <li>• 金融专业学生</li>
                    <li>• 金融从业人员</li>
                    <li>• 投资爱好者</li>
                    <li>• 希望转行金融领域的人士</li>
                  </ul>
                </div>
              ) : (
                <div className="comments-section">
                  {/* 评论表单 */}
                  {currentUser && (
                    <form onSubmit={handleSubmitComment} className="comment-form">
                      <h3>发表评论</h3>
                      <div className="rating-input">
                        <span>评分：</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= userRating ? 'active' : ''}`}
                            onClick={() => handleRating(star)}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="分享你的学习心得..."
                        className="comment-textarea"
                        rows="4"
                      />
                      <button type="submit" className="btn btn-primary">
                        发表评论
                      </button>
                    </form>
                  )}

                  {/* 评论列表 */}
                  <div className="comments-list">
                    <h3>全部评论 ({comments.length})</h3>
                    {comments.length === 0 ? (
                      <div className="no-comments">
                        <p>暂无评论，快来发表第一条评论吧！</p>
                      </div>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                          <img src={comment.authorAvatar} alt={comment.author} className="comment-avatar" />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">{comment.author}</span>
                              {comment.rating > 0 && (
                                <span className="comment-rating">
                                  {'⭐'.repeat(comment.rating)}
                                </span>
                              )}
                              <span className="comment-time">{comment.publishTime}</span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                            <div className="comment-actions">
                              <button className="comment-action-btn">👍 {comment.likes}</button>
                              <button className="comment-action-btn">💬 回复</button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：课程目录 */}
        <div className="lessons-sidebar">
          <div className="lessons-header">
            <h3>课程目录</h3>
            <span className="lessons-count">{course.lessons.length} 课时</span>
          </div>
          <div className="lessons-list">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <span className="lesson-duration">{lesson.duration}</span>
                </div>
                {lesson.completed && (
                  <div className="lesson-status">✓</div>
                )}
              </div>
            ))}
          </div>

          {/* 课程资料 */}
          <div className="course-materials">
            <h3>课程资料</h3>
            <div className="materials-list">
              <div className="material-item">
                <span className="material-icon">📄</span>
                <span className="material-name">课程讲义.pdf</span>
                <button className="material-download">下载</button>
              </div>
              <div className="material-item">
                <span className="material-icon">📊</span>
                <span className="material-name">案例分析.xlsx</span>
                <button className="material-download">下载</button>
              </div>
              <div className="material-item">
                <span className="material-icon">💻</span>
                <span className="material-name">代码示例.zip</span>
                <button className="material-download">下载</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
