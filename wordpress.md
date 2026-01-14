WordPress 高级搜索块开发任务书
项目概述
这是一个结合了 WordPress、REST API 和 React (Gutenberg) 技术的开发测试 。目标是创建一个自定义的 Gutenberg Block，实现文章的高级搜索与筛选功能 。
+2

环境要求

开发环境：使用 Docker 搭建 WordPress 开发环境 。


测试数据：使用 FakerPress 插件创建测试用的文章 (Posts)、分类 (Categories) 和标签 (Tags) 。


交付方式：代码需上传至 GitHub 仓库，并包含数据库备份文件 。
+1

核心功能需求 (Requirements)
Gutenberg 块开发：

创建一个名为“高级搜索块 (Advanced Search Block)”的插件 。

该块需包含搜索表单和搜索结果展示区域 。


加分项：使用 TypeScript 进行开发 。

URL 参数同步：

当搜索表单内容变化时，实时更新浏览器 URL 参数 。

参数示例：https://domain.com/search?q=Test&cat=2&tags[]=1&tags[]=2 。

状态初始化：

页面刷新时，需从 URL 参数中恢复表单状态并自动执行搜索 。

例如：若 URL 中 q=Test，搜索框应自动填充 "Test" 且下方列表显示过滤结果 。

交互技术：

执行搜索动作时必须使用 AJAX (推荐使用 WordPress REST API) 。

搜索字段详述

关键词 (Keyword)：搜索文章中的相关文本 。
+1


分类 (Category)：下拉菜单列表，根据选中的分类过滤文章 。
+1


标签 (Tags) [可选]：通过勾选标签过滤文章 。


分页 (Pagination) [可选]：支持通过分页缩小搜索范围 。
+1

交付清单 (Deliverables)
完整代码：包含所有必要的插件文件。


数据库备份：导出 .sql 文件并存放在项目根目录 。


说明文档：在根目录创建 README.md，说明如何快速运行和理解你的代码逻辑