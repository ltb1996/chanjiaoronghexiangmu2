import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPosts } from '../data/mockData';
import StorageUtil from '../utils/storage';
import './Community.css';

const Community = ({ currentUser }) => {
  const navigate = useNavigate();
  
  // 使用函数式初始化，避免在 useEffect 中同步调用 setState
  const [posts, setPosts] = useState(() => {
    const savedPosts = StorageUtil.getPosts();
    if (savedPosts.length === 0) {
      // 如果没有保存的帖子，使用模拟数据
      return mockPosts;
    } else {
      return savedPosts;
    }
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '股票讨论',
    tags: ''
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', '股票讨论', '投资分析', '风险管理', '基础知识', '行业动态'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSubmitPost = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('请先登录后再发帖');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    const postData = {
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: currentUser.username,
      authorAvatar: currentUser.avatar
    };

    const createdPost = StorageUtil.addPost(postData);
    setPosts([createdPost, ...posts]);
    
    // 重置表单
    setNewPost({
      title: '',
      content: '',
      category: '股票讨论',
      tags: ''
    });
    setShowNewPostForm(false);
    
    alert('发帖成功！');
  };

  const handleLikePost = (postId) => {
    if (!currentUser) {
      alert('请先登录后再点赞');
      return;
    }

    const newLikes = StorageUtil.likePost(postId);
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: newLikes } : post
    ));
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
    } else {
      return timeString;
    }
  };

  return (
    <div className="community-page fade-in">
      <div className="community-header">
        <h1>交流社区</h1>
        <p>与同行交流，向专家请教</p>
      </div>

      {/* 发帖按钮 */}
      <div className="community-actions">
        {currentUser && (
          <button 
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="btn btn-primary new-post-btn"
          >
            {showNewPostForm ? '取消发帖' : '发布新帖'}
          </button>
        )}
      </div>

      {/* 新帖表单 */}
      {showNewPostForm && (
        <div className="new-post-form card">
          <h3>发布新帖</h3>
          <form onSubmit={handleSubmitPost}>
            <div className="form-group">
              <label className="form-label">帖子标题</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="form-control"
                placeholder="请输入帖子标题"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">分类</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="form-control"
              >
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">标签（用逗号分隔）</label>
              <input
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                className="form-control"
                placeholder="例如：股票, 投资, 新手"
              />
            </div>

            <div className="form-group">
              <label className="form-label">帖子内容</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="form-control"
                rows="6"
                placeholder="请输入帖子内容"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                发布帖子
              </button>
              <button 
                type="button" 
                onClick={() => setShowNewPostForm(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="community-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索帖子..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
      </div>

      {/* 帖子统计 */}
      <div className="posts-stats">
        <span>共 {filteredPosts.length} 个讨论</span>
        <span>最新帖子在前</span>
      </div>

      {/* 帖子列表 */}
      <div className="posts-list">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">💬</div>
            <h3>暂无相关讨论</h3>
            <p>成为第一个发言的人吧！</p>
            {currentUser && (
              <button 
                onClick={() => setShowNewPostForm(true)}
                className="btn btn-primary"
              >
                发布新帖
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.authorAvatar} alt={post.author} className="avatar" />
                <div className="post-author-info">
                  <h4>{post.author}</h4>
                  <span className="post-time">{formatTime(post.publishTime)}</span>
                </div>
                <span className="post-category">{post.category}</span>
              </div>

              <div 
                className="post-content"
                onClick={() => navigate(`/community/${post.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="post-actions">
                <button 
                  onClick={() => handleLikePost(post.id)}
                  className="action-btn like-btn"
                >
                  👍 {post.likes}
                </button>
                <button 
                  className="action-btn"
                  onClick={() => navigate(`/community/${post.id}`)}
                >
                  💬 {post.replies} 回复
                </button>
                <button className="action-btn">
                  👁️ {post.views} 浏览
                </button>
                <button className="action-btn share-btn">
                  分享
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;