import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPosts } from '../data/mockData';
import StorageUtil from '../utils/storage';
import './PostDetail.css';

const PostDetail = ({ currentUser }) => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // 使用函数式初始化
  const [post] = useState(() => {
    // 先从localStorage查找
    const savedPosts = StorageUtil.getPosts();
    let foundPost = savedPosts.find(p => p.id === parseInt(postId));
    
    // 如果没找到，从mockData查找
    if (!foundPost) {
      foundPost = mockPosts.find(p => p.id === parseInt(postId));
    }
    
    return foundPost;
  });

  const [replies, setReplies] = useState(() => {
    return post ? StorageUtil.getPostReplies(parseInt(postId)) : [];
  });

  const [newReply, setNewReply] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!currentUser) {
      alert('请先登录后再点赞');
      return;
    }
    
    StorageUtil.likePost(parseInt(postId));
    setIsLiked(!isLiked);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('请先登录后再回复');
      return;
    }

    if (!newReply.trim()) {
      alert('回复内容不能为空');
      return;
    }

    const replyData = {
      content: newReply,
      author: currentUser.username,
      authorAvatar: currentUser.avatar,
      replyToId: replyTo?.id || null,
      replyToAuthor: replyTo?.author || null
    };

    const savedReply = StorageUtil.addPostReply(parseInt(postId), replyData);
    setReplies([...replies, savedReply]);
    setNewReply('');
    setReplyTo(null);

    // 更新帖子回复数
    StorageUtil.incrementPostReplies(parseInt(postId));
  };

  const handleReplyToReply = (reply) => {
    setReplyTo(reply);
    // 滚动到回复框
    document.querySelector('.reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLikeReply = (replyId) => {
    if (!currentUser) {
      alert('请先登录后再点赞');
      return;
    }

    const updatedReplies = replies.map(reply => {
      if (reply.id === replyId) {
        return { ...reply, likes: reply.likes + 1 };
      }
      return reply;
    });
    setReplies(updatedReplies);
    StorageUtil.updatePostReplies(parseInt(postId), updatedReplies);
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return '刚刚';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    } else if (diff < 2592000000) {
      return `${Math.floor(diff / 86400000)}天前`;
    } else {
      return timeString;
    }
  };

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="loading">帖子不存在或已被删除</div>
      </div>
    );
  }

  return (
    <div className="post-detail-page fade-in">
      {/* 返回按钮 */}
      <div className="back-navigation">
        <button onClick={() => navigate('/community')} className="back-btn">
          ← 返回社区
        </button>
      </div>

      {/* 帖子内容 */}
      <div className="post-detail-container">
        <div className="post-main">
          {/* 帖子头部 */}
          <div className="post-header">
            <div className="post-category-badge">{post.category}</div>
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-author-info">
              <img src={post.authorAvatar} alt={post.author} className="author-avatar" />
              <div className="author-details">
                <span className="author-name">{post.author}</span>
                <span className="post-time">{formatTime(post.publishTime)}</span>
              </div>
            </div>
          </div>

          {/* 帖子正文 */}
          <div className="post-content">
            <p>{post.content}</p>
          </div>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* 互动栏 */}
          <div className="post-actions">
            <button 
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <span className="action-icon">👍</span>
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">💬</span>
              <span>{replies.length} 回复</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">👁️</span>
              <span>{post.views} 浏览</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">⭐</span>
              <span>收藏</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🔗</span>
              <span>分享</span>
            </button>
          </div>

          {/* 回复列表 */}
          <div className="replies-section">
            <div className="replies-header">
              <h3>全部回复 ({replies.length})</h3>
            </div>

            {replies.length === 0 ? (
              <div className="no-replies">
                <p>暂无回复，快来发表第一条回复吧！</p>
              </div>
            ) : (
              <div className="replies-list">
                {replies.map((reply, index) => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-number">#{index + 1}</div>
                    <img src={reply.authorAvatar} alt={reply.author} className="reply-avatar" />
                    <div className="reply-content">
                      <div className="reply-header">
                        <span className="reply-author">{reply.author}</span>
                        <span className="reply-time">{formatTime(reply.publishTime)}</span>
                      </div>
                      
                      {reply.replyToAuthor && (
                        <div className="reply-to">
                          回复 <span className="reply-to-name">@{reply.replyToAuthor}</span>
                        </div>
                      )}
                      
                      <p className="reply-text">{reply.content}</p>
                      
                      <div className="reply-actions">
                        <button 
                          className="reply-action-btn"
                          onClick={() => handleLikeReply(reply.id)}
                        >
                          👍 {reply.likes}
                        </button>
                        <button 
                          className="reply-action-btn"
                          onClick={() => handleReplyToReply(reply)}
                        >
                          💬 回复
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 回复表单 */}
          {currentUser ? (
            <form onSubmit={handleSubmitReply} className="reply-form">
              <h3>发表回复</h3>
              {replyTo && (
                <div className="replying-to">
                  <span>回复 @{replyTo.author}</span>
                  <button 
                    type="button" 
                    onClick={() => setReplyTo(null)}
                    className="cancel-reply"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="reply-input-container">
                <img src={currentUser.avatar} alt={currentUser.username} className="current-user-avatar" />
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder={replyTo ? `回复 @${replyTo.author}...` : '写下你的回复...'}
                  className="reply-textarea"
                  rows="4"
                />
              </div>
              <div className="reply-form-actions">
                <button type="submit" className="btn btn-primary">
                  发表回复
                </button>
              </div>
            </form>
          ) : (
            <div className="login-prompt">
              <p>请先<button onClick={() => navigate('/login')} className="login-link">登录</button>后再发表回复</p>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="post-sidebar">
          {/* 作者信息卡片 */}
          <div className="author-card">
            <h3>作者</h3>
            <div className="author-profile">
              <img src={post.authorAvatar} alt={post.author} className="author-avatar-large" />
              <h4>{post.author}</h4>
              <p className="author-bio">热爱金融，乐于分享</p>
              <div className="author-stats">
                <div className="stat-item">
                  <span className="stat-value">12</span>
                  <span className="stat-label">帖子</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">156</span>
                  <span className="stat-label">获赞</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">89</span>
                  <span className="stat-label">粉丝</span>
                </div>
              </div>
              <button className="btn btn-secondary follow-btn">+ 关注</button>
            </div>
          </div>

          {/* 相关帖子 */}
          <div className="related-posts">
            <h3>相关讨论</h3>
            <div className="related-posts-list">
              {mockPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 5).map(relatedPost => (
                <div 
                  key={relatedPost.id} 
                  className="related-post-item"
                  onClick={() => navigate(`/community/${relatedPost.id}`)}
                >
                  <h4>{relatedPost.title}</h4>
                  <div className="related-post-meta">
                    <span>💬 {relatedPost.replies}</span>
                    <span>👁️ {relatedPost.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 热门标签 */}
          <div className="hot-tags">
            <h3>热门标签</h3>
            <div className="tags-cloud">
              <span className="tag-cloud-item">#股票</span>
              <span className="tag-cloud-item">#投资</span>
              <span className="tag-cloud-item">#基金</span>
              <span className="tag-cloud-item">#理财</span>
              <span className="tag-cloud-item">#风险管理</span>
              <span className="tag-cloud-item">#金融市场</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
