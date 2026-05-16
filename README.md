# 🔍 Node.js 代码审计平台（Code Audit Platform）

基于 React + TypeScript + Tailwind CSS + shadcn/ui 构建的**双模式代码审计平台**，系统化覆盖 **代码质量审查** 与 **代码安全性审查** 两大维度，互补协作，全面守护项目健康。

**在线预览：** 👉 [https://mrli-cpp.github.io/code-audit-dashboard/](https://mrli-cpp.github.io/code-audit-dashboard/)

---

## ✨ 双模式功能架构

### 🛡️ 代码质量审查（Quality Audit）

聚焦**技术债务与代码冗余**，帮助重构前系统梳理、日常维护中持续减负。

| 检测维度 | 说明 |
|---------|------|
| **未使用导入** | 扫描 `require` / `import` 中零引用的模块与变量 |
| **死函数识别** | 发现定义但未被调用的函数和方法 |
| **注释代码块** | 检测被注释掉的代码段和废弃逻辑（Git 已保存，源码中应清理） |
| **依赖分析** | 对比 `package.json` 与实际代码中的依赖使用（depcheck） |
| **环境变量审计** | 检查 `.env` 中定义但未通过 `process.env` 引用的配置项 |
| **重复逻辑检测** | 发现多处出现的相似 SQL 查询和代码模式 |
| **圈复杂度分析** | 计算文件和函数的圈复杂度，识别高复杂度模块 |
| **幻数检测** | 发现未命名的字面量数值，建议提取为具名常量 |
| **注释覆盖率审计** | 评估文件注释覆盖率，识别低注释模块 |

### ⚠️ 代码安全性审查（Security Audit）

聚焦**安全漏洞与风险拦截**，基于 OWASP Top 10 与业界最佳实践，覆盖 12+ 类安全威胁检测。

| 检测维度 | 严重级别 | OWASP 对应 |
|---------|---------|-----------|
| **SQL 注入** | 🔴 阻塞 | Top 10 #1 — 字符串拼接查询、参数化缺失 |
| **命令注入 / eval** | 🔴 阻塞 | A03 — `exec()` 拼接、`eval()`、`new Function()` |
| **硬编码密钥** | 🔴 阻塞 | A07 — API Key、密码、Token、AWS/GH 凭证泄露 |
| **XSS / DOM 漏洞** | 🔴 阻塞 | Top 10 #3 — `innerHTML`、`dangerouslySetInnerHTML` 未过滤 |
| **CSRF 防护缺失** | 🔴 阻塞 | A01 — 状态变更路由无 Token / SameSite Cookie |
| **文件上传无校验** | 🔴 阻塞 | A04 — multer 无 MIME / 扩展名 / 文件头白名单 |
| **路径遍历** | 🔴 阻塞 | A01 — `fs.readFile` 拼接用户输入路径 |
| **密码哈希强度** | 🟠 高危 | A07 — MD5/SHA1/SHA256 替代 bcrypt/argon2 |
| **JWT 过期缺失** | 🟠 高危 | A07 — `jwt.sign` 无 `expiresIn`，令牌永久有效 |
| **CORS 危险配置** | 🟠 高危 | A05 — `origin: *` + `credentials: true` 组合 |
| **依赖漏洞 (CVE)** | 🟡 警告 | Top 10 #6 — lodash、ejs、jquery 等已知漏洞 |
| **安全响应头缺失** | 🟡 警告 | A05 — 无 helmet、CSP、HSTS、X-Frame-Options |
| **ReDoS 正则** | 🟡 警告 | A08 — 嵌套量词正则导致指数回溯 |
| **敏感数据日志** | 🟡 警告 | A09 — `console.log` / `logger` 输出 password/token |
| **debugger 残留** | 🔵 提示 | — 生产环境断点语句 |

> **范围锁定**：安全性审查严格限定在"代码安全"范畴，不涉及功能正确性验证、性能优化、UI/UX 设计等非安全领域。

---

## 📊 统一交互界面

无论质量审查还是安全审查，共享一致的交互体验：

| 模块 | 说明 |
|------|------|
| **📊 统计面板** | 总问题数 / 高危 / 警告 / 提示 / 已处理 / 完成率 六维统计 |
| **🔴 严重级别标记** | 阻塞(Critical) / 高危(Warning) / 提示(Info) / 信息(Notice) 四级 |
| **✅ 处理进度追踪** | 每条检查项可勾选标记完成状态，实时更新进度条 |
| **🔍 详情展开** | 问题描述 / 影响评估 / 操作建议 / 代码片段 一键展开 |
| **🗂️ Tab 筛选** | 全部 / 高危 / 警告 / 提示 / 待处理 / 已完成 多条件筛选 |
| **📖 方法论指南** | 内嵌 OWASP 参考、审计方法论、部署前安全检查清单 |
| **📁 示例项目** | 附带质量审计 + 安全审计两套示例数据，开箱体验 |

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
├── public/                        # 静态资源
├── src/
│   ├── App.tsx                    # 主应用入口（四路由配置）
│   ├── main.tsx                   # React DOM 挂载
│   ├── index.css                  # 全局样式 + Tailwind 指令
│   ├── data/
│   │   ├── exampleData.ts         # 质量审计示例数据
│   │   └── securityExampleData.ts # 安全审计示例数据
│   ├── lib/
│   │   ├── scanner.ts             # 质量扫描核心逻辑
│   │   ├── securityScanner.ts     # 安全扫描核心逻辑（12+ 检测器）
│   │   └── utils.ts               # 工具函数
│   ├── types/
│   │   └── audit.ts               # TypeScript 类型定义（共享）
│   ├── pages/
│   │   ├── HomePage.tsx           # 质量审查主页（含双入口卡片）
│   │   ├── ExamplesPage.tsx       # 质量审查示例报告
│   │   ├── SecurityPage.tsx       # 安全审查主页
│   │   └── SecurityExamplesPage.tsx # 安全审查示例报告
│   ├── components/
│   │   ├── Layout.tsx             # 页面布局（四栏导航）
│   │   ├── AuditItemCard.tsx      # 审计项卡片（质量/安全共用）
│   │   └── ui/                    # shadcn/ui 组件库（60+ 组件）
│   └── hooks/
│       └── use-mobile.ts          # 移动端适配 Hook
├── tailwind.config.js             # Tailwind 配置
├── vite.config.ts                 # Vite 配置
└── package.json
```

---

## 🔧 质量审查：审计维度详解

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

## 🔐 安全审查：检测器详解

### 注入漏洞（OWASP #1）
- **SQL 注入**：检测字符串拼接查询，要求参数化查询 / ORM
- **命令注入**：检测 `child_process.exec()` 拼接、字符串模板注入
- **eval 注入**：检测 `eval()`、`new Function()` 使用，要求 JSON.parse 替代
- **ReDoS**：检测嵌套量词正则（`(a+)*`），要求重构或使用 re2 引擎

### 敏感数据泄露（OWASP A07）
- **硬编码密钥**：API Key、密码、Token、AWS Access Key、GitHub Token、OpenAI Key
- **敏感日志**：`console.log` / `logger` 输出中包含 password、secret、token、请求体
- **环境文件**：`.env` 中敏感值未通过 KMS/Secrets Manager 管理

### 前端安全（OWASP #3）
- **XSS 漏洞**：`innerHTML` 动态赋值、`dangerouslySetInnerHTML`、jQuery `.html()`、 `document.write()`
- **DOM 净化**：要求 DOMPurify 或白名单过滤

### 认证与授权（OWASP A01/A07）
- **CSRF 防护**：检测 POST/PUT/DELETE/PATCH 路由是否缺少 csurf / SameSite Cookie
- **密码哈希**：检测 MD5/SHA1/SHA256 用于密码，要求 bcrypt(cost≥12) / argon2id
- **JWT 安全**：检测 `jwt.sign()` 无 `expiresIn`，要求 ≤1h + refresh token
- **CORS 配置**：检测 `origin: *` + `credentials: true` 危险组合

### 文件与路径安全（OWASP A01/A04）
- **文件上传**：检测 multer/formidable 无 MIME/扩展名/文件头校验
- **路径遍历**：检测 `fs.readFile` / `res.sendFile` 拼接用户输入路径

### 依赖与供应链（OWASP #6）
- **已知漏洞依赖**：lodash(CVE-2019-10744)、ejs、jquery、handlebars 等
- **版本锁定**：检查 `package-lock.json` 完整性
- **最小依赖原则**：未使用依赖包扫描

### 部署与运行时安全
- **安全响应头**：检测 helmet、CSP、HSTS、X-Frame-Options 缺失
- **debug 残留**：检测 `debugger` 语句、生产环境 `console.log` 过多

---

## 📝 使用场景

| 场景 | 推荐模式 | 说明 |
|------|---------|------|
| **项目重构前** | 质量审查 | 系统梳理技术债务，评估清理工作量 |
| **上线前安全检查** | 安全审查 | 拦截注入、XSS、密钥泄露等阻断部署漏洞 |
| **代码审查后** | 两者结合 | 质量债务 + 安全风险统一可视化呈现 |
| **技术分享/演示** | 示例报告 | 开箱即用的质量/安全两套示例数据 |
| **个人项目维护** | 定期双查 | 定期扫描冗余代码 + 安全漏洞 |

---

## 📌 数据源说明

审计数据支持两种输入方式：

1. **实时扫描**：上传项目文件夹，前端静态解析 JS/TS/SQL/JSON/Env 文件，本地执行正则匹配与模式检测（无后端、无数据上传）
2. **示例数据**：`exampleData.ts`（质量）与 `securityExampleData.ts`（安全）提供开箱即用的演示数据

TypeScript 共享类型定义：

```typescript
interface AuditItem {
  id: string;
  severity: "critical" | "warning" | "info" | "notice";
  category: string;         // 检测维度分类
  title: string;
  location: string;         // 文件路径 + 行号
  description: string;      // 问题描述
  impact: string;           // 影响评估（含验证方式）
  action: string;           // 操作建议
  codeSnippet: string;      // 相关代码片段
  checked: boolean;         // 处理状态
  complexity?: number;      // 圈复杂度或影响评分 1-10
  effortHours?: number;     // 预估修复工时
}
```

---

## 📦 部署方式

本项目使用 **GitHub Pages** 进行静态托管。修改代码后务必重新构建并部署：

```bash
# 1. 构建生产版本
npm run build

# 2. 部署到 GitHub Pages（dist/ 目录）
git push origin `git subtree split --prefix dist main`:gh-pages --force
```

> ⚠️ 本地开发验证：`npm run dev` → `http://localhost:5173/`

---

## 📄 License

MIT © 2026 [李霁光](https://github.com/MrLi-cpp)

---

## 🔗 相关项目

- [my-website](https://github.com/MrLi-cpp/my-website) — 被审计的目标项目（Node.js + Express + SQLite 全栈网站）
