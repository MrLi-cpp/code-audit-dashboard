# 🔍 代码审计仪表盘（Code Audit Dashboard）

基于 React + TypeScript + Tailwind CSS + shadcn/ui 构建的代码审计报告可视化仪表盘。用于系统化展示 Node.js / 前端项目的**冗余代码检测、历史功能残留排查和架构级冗余**分析结果。

**在线预览：** 👉 [https://mrli-cpp.github.io/code-audit-dashboard/](https://mrli-cpp.github.io/code-audit-dashboard/)

---

## ✨ 功能特性

| 模块 | 说明 |
|------|------|
| **📊 统计面板** | 总问题数 / 严重 / 建议 / 提示 / 已处理 / 完成率 六维统计 |
| **📋 分类检查项** | 冗余代码检测 / 历史功能残留排查 / 架构级冗余 三大维度 |
| **🔴 严重级别标记** | 严重(Critical) / 建议(Warning) / 提示(Info) 三级 |
| **✅ 处理进度追踪** | 每条检查项可勾选标记完成状态，实时更新进度条 |
| **🔍 详情展开** | 问题描述 / 影响评估 / 操作建议 / 代码片段 一键展开 |
| **🗂️ Tab 筛选** | 全部 / 严重 / 建议 / 提示 / 待处理 / 已完成 多条件筛选 |
| **📖 审计方法论** | 内嵌静态分析工具、数据库验证、路由验证、Git 历史验证指南 |
| **📁 示例项目** | 附带示例审计数据，可直接体验完整功能 |

---

## 🛠 技术栈

- **框架：** React 19 + React Router 7 + Vite 7
- **语言：** TypeScript 5.9
- **样式：** Tailwind CSS 3.4 + shadcn/ui 组件库
- **状态：** React Hooks (useState)
- **图标：** Lucide React
- **工具链：** ESLint 9 + PostCSS + Autoprefixer

---

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/MrLi-cpp/code-audit-dashboard.git
cd code-audit-dashboard

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 📁 项目结构

```
├── public/              # 静态资源
├── src/
│   ├── App.tsx          # 主应用入口（路由配置）
│   ├── main.tsx         # React DOM 挂载
│   ├── index.css        # 全局样式 + Tailwind 指令
│   ├── data/
│   │   └── exampleData.ts      # 示例审计数据
│   ├── lib/
│   │   ├── scanner.ts          # 静态扫描核心逻辑
│   │   └── utils.ts            # 工具函数
│   ├── types/
│   │   └── audit.ts            # TypeScript 类型定义
│   ├── pages/
│   │   ├── HomePage.tsx        # 审计仪表盘主页
│   │   └── ExamplesPage.tsx    # 示例报告页
│   ├── components/
│   │   ├── Layout.tsx          # 页面布局
│   │   ├── AuditItemCard.tsx   # 审计项卡片组件
│   │   └── ui/                 # shadcn/ui 组件库（60+ 组件）
│   └── hooks/
│       └── use-mobile.ts       # 移动端适配 Hook
├── tailwind.config.js   # Tailwind 配置
├── vite.config.ts       # Vite 配置
└── package.json
```

---

## 🔧 审计维度说明

### 1. 冗余代码检测
- 未使用的导入模块 / 变量 / 常量
- 死函数 / 死方法（零引用）
- 重复的数据库查询逻辑
- 过度工程化的设计模式（如永远只实例化单一策略的抽象工厂）
- 注释掉的代码块（180+ 行僵尸代码）

### 2. 历史功能残留排查
- 废弃路由（30 天零请求）
- 僵尸中间件（从未触发）
- 废弃数据库表 / 字段（90 天零写入）
- 未使用的 npm 依赖包（depcheck 扫描）
- 残留静态资源 / 过期迁移脚本

### 3. 架构级冗余
- 重复路由逻辑（多个端点实现相同功能）
- 过度封装的工具类（每个方法仅调用一次）
- 未触发的错误处理分支
- 永不执行的事件监听器

---

## 📝 使用场景

1. **项目重构前** — 系统梳理技术债务，评估清理工作量
2. **代码审查后** — 将审计结果可视化呈现给团队
3. **技术分享** — 作为代码质量分析的演示工具
4. **个人项目维护** — 定期扫描长期积累的冗余代码

---

## 📌 数据源说明

审计数据以 TypeScript 常量形式存储在 `src/data/exampleData.ts` 中，结构如下：

```typescript
interface AuditItem {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  location: string;         // 文件路径 + 行号
  description: string;      // 问题描述
  impact: string;           // 影响评估（含验证方式）
  action: string;           // 操作建议
  codeSnippet: string;      // 相关代码片段
  checked: boolean;         // 处理状态
}
```

如需审计自己的项目，直接修改 `exampleData.ts` 中的数据即可。

---

## 📦 部署方式

本项目使用 **GitHub Pages** 进行静态托管，部署命令：

```bash
npm run build
# 将 dist/ 目录内容推送到 gh-pages 分支
git push origin `git subtree split --prefix dist main`:gh-pages --force
```

---

## 📄 License

MIT © 2026 [李霁光](https://github.com/MrLi-cpp)

---

## 🔗 相关项目

- [my-website](https://github.com/MrLi-cpp/my-website) — 被审计的目标项目（Node.js + Express + SQLite 全栈网站）
