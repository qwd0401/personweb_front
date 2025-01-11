# 个人作品集网站

一个使用 React + TypeScript + Material-UI 构建的现代化个人作品集网站。

## 📸 项目截图

### 首页
![首页截图](screenshots/home.png)
*展示个人简介和主要导航*

### 项目展示页
![项目页截图](screenshots/projects.png)
*展示个人项目作品，支持筛选和搜索*

### 博客页面
![博客页截图](screenshots/blog.png)
*技术博客列表，支持标签分类*

### 联系页面
![联系页截图](screenshots/contact.png)
*联系表单和联系方式*

## 🌟 特性

- 💻 响应式设计，完美适配各种设备
- 🎨 精美的动画效果 (Framer Motion)
- 🌍 支持国际化 (i18next)
- 🎯 TypeScript 类型支持
- 🎨 Material UI 组件库
- 🌙 支持深色模式
- 📱 移动端优先的设计理念

## 🛠️ 技术栈

- React 18
- TypeScript
- Material-UI (v5)
- Framer Motion
- React Router v6
- i18next
- Axios

## 📦 安装和运行

1. **克隆项目**
git clone https://github.com/qwd0401/personwebfont.git
cd personwebfont
*
bash
npm install
*
bash
npm run dev
*
bash
npm run build
src/
├── components/ # 可复用组件
├── pages/ # 页面组件
├── services/ # API 服务
├── types/ # TypeScript 类型定义
├── utils/ # 工具函数
├── i18n/ # 国际化配置
└── theme/ # 主题配置
文件：
env
VITE_API_URL=你的API地址
API配置
REACT_APP_API_URL=你的API地址
REACT_APP_API_KEY=你的API密钥
其他配置
REACT_APP_GA_TRACKING_ID=Google分析跟踪ID
typescript
// 自定义主题示例
const theme = createTheme({
palette: {
primary: {
main: '#6200EA',
},
secondary: {
main: '#B388FF',
},
},
});
typescript
// zh-CN.json
{
"home": {
"title": "你好，我是...",
"description": "..."
}
}
添加新页面
typescript
// src/pages/NewPage.tsx
import { Container, Typography } from '@mui/material';
const NewPage = () => {
return (
<Container maxWidth="lg">
<Typography variant="h1">新页面</Typography>
</Container>
);
};
export default NewPage;
使用动画组件
typescript
import { motion } from 'framer-motion';
const AnimatedComponent = () => {
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.6 }}
>
内容
</motion.div>
);
};
添加新的API请求
typescript
// src/services/api.ts
export const newApiCall = async (data: any) => {
const response = await axios.post('/api/endpoint', data);
return response.data;
};

## 🔧 常见问题解决

1. **构建失败**
   - 检查 Node.js 版本 (推荐 v16+)
   - 清除依赖缓存: `npm clean-cache`
   - 重新安装依赖: `rm -rf node_modules && npm install`

2. **样式问题**
   - 确保 Material-UI 样式优先级
   - 检查主题配置是否正确

## 📈 性能优化

- 使用 React.lazy 进行代码分割
- 图片懒加载
- 组件缓存优化
- 路由预加载

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 👤 作者

- GitHub: [@qwd0401](https://github.com/qwd0401)

## 🙏 致谢

- Material-UI 团队
- Framer Motion 团队
- React 社区
