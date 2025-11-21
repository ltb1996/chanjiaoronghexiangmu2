// 模拟用户数据
export const mockUsers = [
  {
    id: 1,
    username: 'student01',
    email: 'student01@example.com',
    password: '123456',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student01',
    joinDate: '2024-01-15',
    coursesCompleted: 5,
    totalScore: 850,
    level: '初级学员'
  },
  {
    id: 2,
    username: 'teacher01',
    email: 'teacher01@example.com',
    password: '123456',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher01',
    joinDate: '2024-01-10',
    coursesCompleted: 15,
    totalScore: 1200,
    level: '高级讲师'
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    joinDate: '2024-01-01',
    coursesCompleted: 20,
    totalScore: 1500,
    level: '管理员'
  }
];

// 导入视频文件
import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';

// 模拟课程数据
export const mockCourses = [
  {
    id: 1,
    title: '金融市场基础',
    description: '了解金融市场的基本运作机制，包括股票市场、债券市场、外汇市场等',
    instructor: '张教授',
    duration: '8小时',
    difficulty: '初级',
    category: '基础知识',
    enrolledStudents: 156,
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    lessons: [
      { id: 1, title: '金融市场概述', duration: '45分钟', completed: false, videoUrl: video1 },
      { id: 2, title: '股票市场基础', duration: '60分钟', completed: false, videoUrl: video2 },
      { id: 3, title: '债券市场入门', duration: '50分钟', completed: false, videoUrl: video3 }
    ]
  },
  {
    id: 2,
    title: '投资组合管理',
    description: '学习如何构建和管理投资组合，理解风险与收益的平衡，掌握了解市场动态',
    instructor: '李博士',
    duration: '12小时',
    difficulty: '中级',
    category: '投资分析',
    enrolledStudents: 89,
    rating: 4.6,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    lessons: [
      { id: 1, title: '投资组合理论', duration: '90分钟', completed: false, videoUrl: video1 },
      { id: 2, title: '资产配置策略', duration: '75分钟', completed: false, videoUrl: video2 }
    ]
  },
  {
    id: 3,
    title: '金融风险管理',
    description: '掌握金融风险的识别、评估和控制方法。把握金融风险投资情况',
    instructor: '王专家',
    duration: '10小时',
    difficulty: '高级',
    category: '风险管理',
    enrolledStudents: 67,
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    lessons: [
      { id: 1, title: '风险类型与识别', duration: '60分钟', completed: false, videoUrl: video1 },
      { id: 2, title: 'VaR模型应用', duration: '90分钟', completed: false, videoUrl: video2 }
    ]
  }
];

// 模拟社区帖子数据
export const mockPosts = [
  {
    id: 1,
    title: '如何理解股票市场的波动性？',
    content: '最近在学习股票市场，对波动性这个概念还是有些模糊，有没有同学能帮忙解释一下？',
    author: 'student01',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student01',
    category: '股票讨论',
    publishTime: '2024-01-20 14:30',
    likes: 15,
    replies: 8,
    views: 156,
    tags: ['股票', '波动性', '新手入门']
  },
  {
    id: 2,
    title: '分享一个投资组合优化的案例',
    content: '最近做了一个关于投资组合优化的项目，想和大家分享一下心得体会...',
    author: 'teacher01',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher01',
    category: '投资分析',
    publishTime: '2024-01-19 16:45',
    likes: 32,
    replies: 12,
    views: 289,
    tags: ['投资组合', '优化', '案例分享']
  },
  {
    id: 3,
    title: '金融风险管理中的VaR计算问题',
    content: '在计算VaR时，历史模拟法和蒙特卡洛模拟法各有什么优缺点？',
    author: 'student02',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student02',
    category: '风险管理',
    publishTime: '2024-01-18 09:20',
    likes: 8,
    replies: 5,
    views: 98,
    tags: ['VaR', '风险管理', '计算方法']
  }
];

// 模拟问答数据
export const mockQuestions = [
  {
    id: 1,
    title: '什么是系统性风险？',
    content: '在学习金融风险时，经常听到系统性风险这个词，具体是什么意思？',
    author: 'student03',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student03',
    category: '基础知识',
    publishTime: '2024-01-21 11:15',
    likes: 5,
    answers: [
      {
        id: 1,
        content: '系统性风险是指影响整个金融系统的风险，比如金融危机、经济衰退等，不能通过分散投资来消除。',
        author: 'teacher01',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher01',
        publishTime: '2024-01-21 12:30',
        likes: 12,
        isBest: true
      }
    ]
  }
];

// 模拟学习进度数据
export const mockLearningProgress = {
  student01: {
    totalCourses: 3,
    completedCourses: 1,
    totalHours: 24,
    completedHours: 8,
    achievements: ['初学者', '课程完成者'],
    currentStreak: 7,
    weeklyGoal: 10,
    weeklyProgress: 7
  }
};