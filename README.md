# WordPress Advanced Search Block

一个功能强大的 WordPress Gutenberg Block 插件，提供高级文章搜索功能，支持关键词搜索、分类筛选、标签筛选和分页。

## 功能特性

- ✅ **关键词搜索**: 搜索文章标题和内容
- ✅ **分类筛选**: 通过下拉菜单按分类筛选文章
- ✅ **标签筛选**: 通过复选框选择多个标签进行筛选
- ✅ **分页支持**: 搜索结果支持分页浏览
- ✅ **URL 参数同步**: 搜索条件自动同步到 URL，支持分享和书签
- ✅ **状态恢复**: 页面刷新时自动从 URL 恢复搜索状态
- ✅ **AJAX 搜索**: 使用 WordPress REST API 实现无刷新搜索
- ✅ **TypeScript 开发**: 使用 TypeScript 确保代码质量
- ✅ **响应式设计**: 适配移动端和桌面端

## 技术栈

- **WordPress**: 最新版本
- **TypeScript**: 类型安全
- **React**: Gutenberg Block 开发
- **WordPress REST API**: 数据获取
- **@wordpress/scripts**: 官方构建工具

## 环境要求

- Node.js 16+ 和 npm
- Docker 和 Docker Compose（用于本地开发）
- WordPress 5.9+（支持 Gutenberg）

## 快速开始

### 1. 启动 WordPress 环境

```bash
# 在项目根目录执行
docker-compose up -d
```

这将启动：
- WordPress 容器（端口 8080）
- MySQL 数据库容器

访问 http://localhost:8080 完成 WordPress 安装。

### 2. 安装插件依赖

```bash
cd advanced-search-block
npm install
```

### 3. 构建插件

```bash
npm run build
```

开发模式（监听文件变化）：
```bash
npm start
```

### 4. 激活插件

1. 登录 WordPress 后台
2. 进入「插件」页面
3. 找到「Advanced Search Block」并激活

### 5. 使用 Block

1. 编辑任意页面或文章
2. 点击「+」添加 Block
3. 搜索「Advanced Search Block」
4. 添加到页面中
5. 发布页面

## 生成测试数据

推荐使用 [FakerPress](https://wordpress.org/plugins/fakerpress/) 插件生成测试数据：

1. 在 WordPress 后台安装并激活 FakerPress 插件
2. 进入「工具」→「FakerPress」
3. 生成文章、分类和标签
4. 测试搜索功能

## 项目结构

```
advanced-search-block/
├── advanced-search-block.php    # 插件主文件
├── package.json                 # Node.js 依赖配置
├── tsconfig.json               # TypeScript 配置
├── webpack.config.js           # Webpack 构建配置
├── src/
│   ├── index.tsx               # Block 编辑器入口
│   ├── style.css               # 样式文件
│   ├── block/                  # Block 相关代码
│   │   ├── index.tsx          # Block 注册
│   │   ├── edit.tsx           # 编辑器视图
│   │   └── block.json         # Block 元数据
│   ├── frontend/               # 前端渲染代码
│   │   ├── index.tsx          # 前端入口
│   │   ├── SearchForm.tsx     # 搜索表单组件
│   │   ├── SearchResults.tsx  # 搜索结果组件
│   │   └── hooks/             # React Hooks
│   │       ├── useSearchParams.ts    # URL 参数管理
│   │       └── useSearchResults.ts   # 搜索 API 调用
│   ├── api/                    # REST API（PHP）
│   └── types/                  # TypeScript 类型定义
└── build/                      # 构建输出目录
```

## REST API 端点

插件注册了以下 REST API 端点：

- `GET /wp-json/advanced-search/v1/search` - 搜索文章
  - 参数: `keyword`, `category`, `tags[]`, `page`, `per_page`
- `GET /wp-json/advanced-search/v1/categories` - 获取分类列表
- `GET /wp-json/advanced-search/v1/tags` - 获取标签列表

## URL 参数格式

搜索条件会自动同步到 URL：

- 关键词: `?q=Test`
- 分类: `?cat=2`
- 标签: `?tags[]=1&tags[]=2`
- 分页: `?page=2`
- 组合: `?q=Test&cat=2&tags[]=1&tags[]=2&page=1`

## 开发说明

### 代码逻辑

1. **Block 注册** (`src/block/index.tsx`)
   - 使用 `registerBlockType` 注册动态 Block
   - `save` 函数返回 `null`，表示动态渲染

2. **前端渲染** (`src/frontend/index.tsx`)
   - 在 DOM 加载完成后查找所有 `.advanced-search-block-container` 容器
   - 使用 React 渲染搜索组件

3. **URL 参数管理** (`src/frontend/hooks/useSearchParams.ts`)
   - 从 URL 读取参数初始化状态
   - 表单变化时更新 URL（使用 `history.pushState`）
   - 监听浏览器前进/后退事件

4. **搜索功能** (`src/frontend/hooks/useSearchResults.ts`)
   - 调用 REST API 获取搜索结果
   - 处理加载状态和错误
   - 自动在参数变化时重新搜索

5. **REST API** (`advanced-search-block.php`)
   - 使用 `WP_Query` 构建查询
   - 返回格式化的 JSON 数据
   - 支持关键词、分类、标签筛选

### 构建流程

1. TypeScript 编译为 JavaScript
2. React 组件转换
3. Webpack 打包（编辑器代码和前端代码分别打包）
4. 输出到 `build/` 目录

### 样式定制

样式文件位于 `src/style.css`，可以根据主题需求进行定制。所有样式类名以 `asb-` 前缀开头，避免与主题样式冲突。

## 数据库备份

使用以下命令导出数据库：

```bash
docker exec wp-advanced-search-db mysqldump -u wordpress -pwordpress wordpress > database.sql
```

## 故障排除

### Block 不显示

1. 确保插件已激活
2. 检查浏览器控制台是否有错误
3. 运行 `npm run build` 重新构建

### 搜索无结果

1. 确保有已发布的文章
2. 检查 REST API 是否可访问：访问 `http://localhost:8080/wp-json/advanced-search/v1/categories`
3. 检查浏览器控制台的网络请求

### 样式不显示

1. 确保 `build/style-index.css` 文件存在
2. 清除浏览器缓存
3. 检查 WordPress 是否正确加载了样式文件

## 许可证

GPL-2.0-or-later

## 贡献

欢迎提交 Issue 和 Pull Request！
