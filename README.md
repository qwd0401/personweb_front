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
npm install
npm run dev
npm run build

src/
├── components/ # 可复用组件
├── pages/ # 页面组件
├── services/ # API 服务
├── types/ # TypeScript 类型定义
├── utils/ # 工具函数
├── i18n/ # 国际化配置
└── theme/ # 主题配置


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
