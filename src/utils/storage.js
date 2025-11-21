// 本地存储工具类
class StorageUtil {
  // 用户相关
  static setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  static removeCurrentUser() {
    localStorage.removeItem('currentUser');
  }

  // 课程进度相关
  static getCourseProgress(userId, courseId) {
    const key = `course_progress_${userId}_${courseId}`;
    const progress = localStorage.getItem(key);
    return progress ? JSON.parse(progress) : null;
  }

  static setCourseProgress(userId, courseId, progress) {
    const key = `course_progress_${userId}_${courseId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  }

  // 学习记录相关
  static getLearningRecords(userId) {
    const key = `learning_records_${userId}`;
    const records = localStorage.getItem(key);
    return records ? JSON.parse(records) : [];
  }

  static addLearningRecord(userId, record) {
    const records = this.getLearningRecords(userId);
    records.push({
      ...record,
      timestamp: new Date().toISOString()
    });
    const key = `learning_records_${userId}`;
    localStorage.setItem(key, JSON.stringify(records));
  }

  // 社区数据相关
  static getPosts() {
    const posts = localStorage.getItem('community_posts');
    return posts ? JSON.parse(posts) : [];
  }

  static addPost(post) {
    const posts = this.getPosts();
    const newPost = {
      ...post,
      id: Date.now(),
      publishTime: new Date().toLocaleString('zh-CN'),
      likes: 0,
      replies: 0,
      views: 0
    };
    posts.unshift(newPost);
    localStorage.setItem('community_posts', JSON.stringify(posts));
    return newPost;
  }

  static likePost(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      localStorage.setItem('community_posts', JSON.stringify(posts));
      return post.likes;
    }
    return 0;
  }

  // 帖子回复相关
  static getPostReplies(postId) {
    const key = `post_replies_${postId}`;
    const replies = localStorage.getItem(key);
    return replies ? JSON.parse(replies) : [];
  }

  static addPostReply(postId, reply) {
    const replies = this.getPostReplies(postId);
    const newReply = {
      ...reply,
      id: Date.now(),
      publishTime: new Date().toLocaleString('zh-CN'),
      likes: 0
    };
    replies.push(newReply);
    const key = `post_replies_${postId}`;
    localStorage.setItem(key, JSON.stringify(replies));
    return newReply;
  }

  static updatePostReplies(postId, replies) {
    const key = `post_replies_${postId}`;
    localStorage.setItem(key, JSON.stringify(replies));
  }

  static incrementPostReplies(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.replies += 1;
      localStorage.setItem('community_posts', JSON.stringify(posts));
    }
  }

  // 问答数据相关
  static getQuestions() {
    const questions = localStorage.getItem('qa_questions');
    return questions ? JSON.parse(questions) : [];
  }

  static addQuestion(question) {
    const questions = this.getQuestions();
    const newQuestion = {
      ...question,
      id: Date.now(),
      publishTime: new Date().toLocaleString('zh-CN'),
      likes: 0,
      answers: []
    };
    questions.unshift(newQuestion);
    localStorage.setItem('qa_questions', JSON.stringify(questions));
    return newQuestion;
  }

  static addAnswer(questionId, answer) {
    const questions = this.getQuestions();
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newAnswer = {
        ...answer,
        id: Date.now(),
        publishTime: new Date().toLocaleString('zh-CN'),
        likes: 0,
        isBest: false
      };
      question.answers.push(newAnswer);
      localStorage.setItem('qa_questions', JSON.stringify(questions));
      return newAnswer;
    }
    return null;
  }

  // 用户设置相关
  static getUserSettings(userId) {
    const key = `user_settings_${userId}`;
    const settings = localStorage.getItem(key);
    return settings ? JSON.parse(settings) : {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      emailUpdates: false
    };
  }

  static setUserSettings(userId, settings) {
    const key = `user_settings_${userId}`;
    localStorage.setItem(key, JSON.stringify(settings));
  }

  // 课程评论相关
  static getCourseComments(courseId) {
    const key = `course_comments_${courseId}`;
    const comments = localStorage.getItem(key);
    return comments ? JSON.parse(comments) : [];
  }

  static addCourseComment(courseId, comment) {
    const comments = this.getCourseComments(courseId);
    const newComment = {
      ...comment,
      id: Date.now(),
      publishTime: new Date().toLocaleString('zh-CN'),
      likes: 0
    };
    comments.unshift(newComment);
    const key = `course_comments_${courseId}`;
    localStorage.setItem(key, JSON.stringify(comments));
    return newComment;
  }

  // 清除所有数据（调试用）
  static clearAll() {
    localStorage.clear();
  }
}

export default StorageUtil;