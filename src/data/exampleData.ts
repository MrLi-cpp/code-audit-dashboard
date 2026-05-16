import type { CategoryGroup } from "@/types/audit";

export const exampleAuditData: CategoryGroup[] = [
  {
    id: "redundant-code",
    title: "冗余代码检测",
    description: "扫描项目中未使用的变量、死函数、重复逻辑和过度工程化代码",
    icon: "Code2",
    items: [
      {
        id: "rc-1",
        severity: "critical",
        category: "冗余代码检测",
        title: "未使用的导入模块",
        location: "src/middleware/auth.js (第3-8行)",
        description:
          "导入了 jsonwebtoken 和 bcrypt 两个模块，但当前认证逻辑已改用 Passport.js 策略，这两个模块在文件中无任何引用。",
        impact:
          "删除后不影响功能。已通过全局搜索确认 jsonwebtoken 和 bcrypt 仅在 auth.js 中导入但未被调用。",
        action: "直接删除未使用的 import/require 语句",
        codeSnippet: `const jwt = require('jsonwebtoken');      // 未使用
const bcrypt = require('bcrypt');         // 未使用
const passport = require('passport');     // 实际使用的模块`,
        checked: false,
      },
      {
        id: "rc-2",
        severity: "warning",
        category: "冗余代码检测",
        title: "解构赋值中的无用字段",
        location: "src/controllers/user.js (第45行)",
        description:
          "从数据库查询结果中解构了 password 和 salt 字段，但后续逻辑仅使用 id 和 email。password 字段存在安全风险。",
        impact:
          "删除后提升安全性。解构出的 password 和 salt 未被任何后续代码引用。",
        action: "从解构中移除敏感字段，或改为明确指定需要的字段",
        codeSnippet: `// 当前代码（有风险）
const { id, email, name, password, salt } = user;

// 建议修改为
const { id, email, name } = user;`,
        checked: false,
      },
      {
        id: "rc-3",
        severity: "critical",
        category: "冗余代码检测",
        title: "死函数：legacyHashPassword",
        location: "src/utils/crypto.js (第22-35行)",
        description:
          "函数 legacyHashPassword 用于旧的 MD5 密码哈希，系统已于 v2.1 迁移到 bcrypt，此函数无任何调用链。",
        impact:
          "删除后不影响功能。已通过 VS Code 'Find All References' 和 grep 双重确认零引用。",
        action: "直接删除该函数及其相关注释文档",
        codeSnippet: `/**
 * @deprecated 已废弃，v2.1 起使用 bcrypt
 * 旧版 MD5 哈希函数
 */
function legacyHashPassword(password) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(password).digest('hex');
}`,
        checked: false,
      },
      {
        id: "rc-4",
        severity: "warning",
        category: "冗余代码检测",
        title: "重复的数据库查询逻辑",
        location: "src/services/*.js (多处)",
        description:
          "userService.findByEmail()、authService.getUserByEmail()、adminService.lookupUser() 三个函数执行完全相同的 SQL 查询但各自独立实现。",
        impact:
          "提取为公共函数后不影响功能。建议统一到 db/models/user.js 中维护。",
        action: "提取为共享的 User.findByEmail() 方法，三个 service 统一调用",
        codeSnippet: `// userService.js - 重复实现 #1
const findByEmail = (email) => db.get('SELECT * FROM users WHERE email = ?', email);

// authService.js - 重复实现 #2  
const getUserByEmail = (email) => db.query('SELECT * FROM users WHERE email = ?', [email]);

// adminService.js - 重复实现 #3
const lookupUser = (email) => db.run(\`SELECT * FROM users WHERE email='\${email}'\`);`,
        checked: false,
      },
      {
        id: "rc-5",
        severity: "info",
        category: "冗余代码检测",
        title: "过度封装的 StrategyFactory",
        location: "src/patterns/ (整个目录)",
        description:
          "项目引入了完整的抽象工厂模式来实现数据库连接策略（MySQL/Postgres/SQLite），但实际仅使用 SQLite，且无任何切换需求。",
        impact:
          "简化后不影响功能。当前工厂模式增加了 6 个文件、~400 行代码，但永远只实例化 SQLite 策略。",
        action: "扁平化为直接的 SQLite 连接模块，删除整个 patterns/ 目录",
        codeSnippet: `// 当前：过度抽象
const factory = new StrategyFactory();
const db = factory.create('sqlite');  // 永远只创建 SQLite

// 建议：直接实例化
const db = require('./db/sqlite');`,
        checked: false,
      },
      {
        id: "rc-6",
        severity: "warning",
        category: "冗余代码检测",
        title: "注释掉的代码块（180+行）",
        location: "src/routes/api.js (第88-120行)、src/app.js (第200-250行)",
        description:
          "存在大量被注释掉的旧版路由注册代码和中间件配置，最早注释日期为 6 个月前，已远超评估保留期限。",
        impact:
          "删除后不影响功能。这些代码块已被 Git 历史完整保存，无需在源码中保留。",
        action: "删除注释代码，如需恢复可从 Git history 检出",
        codeSnippet: `/* === 旧版 v1 API（2024-01 废弃）===
app.use('/api/v1/users', userRoutesV1);
app.use('/api/v1/posts', postRoutesV1);
// app.use('/api/v1/comments', commentRoutesV1);  // 功能未上线
=== 旧版 v1 API 结束 === */`,
        checked: false,
      },
    ],
  },
  {
    id: "legacy-features",
    title: "历史功能残留排查",
    description: "排查废弃路由、僵尸中间件、无用依赖包和过期配置文件",
    icon: "Archive",
    items: [
      {
        id: "lf-1",
        severity: "critical",
        category: "历史功能残留排查",
        title: "废弃的 /api/v1/* 路由注册",
        location: "src/app.js (第55-58行)",
        description:
          "注册了 /api/v1/users、/api/v1/posts 等路由，但前端已从 v1 迁移到 v2 达 4 个月，Nginx 访问日志显示 v1 端点 30 天零请求。",
        impact:
          "删除后不影响现有功能。前端代码库已无 v1 端点调用，移动 App 最新版本也使用 v2。",
        action: "删除 v1 路由注册及相关 router 文件",
        codeSnippet: `// 待删除的废弃路由
app.use('/api/v1/users', require('./routes/v1/users'));
app.use('/api/v1/posts', require('./routes/v1/posts'));
app.use('/api/v1/auth', require('./routes/v1/auth'));

// 保留的当前路由
app.use('/api/v2/users', require('./routes/v2/users'));`,
        checked: false,
      },
      {
        id: "lf-2",
        severity: "warning",
        category: "历史功能残留排查",
        title: "僵尸中间件：rateLimiterV1",
        location: "src/app.js (第42行)",
        description:
          "应用层注册了 rateLimiterV1 中间件，但所有经过的请求都先被 Nginx 层限速处理，此 Express 层限速从未触发。",
        impact:
          "删除后不影响功能。Nginx 已配置 limit_req_zone，且中间件执行日志显示计数器恒为 0。",
        action: "删除 Express 层重复限速中间件，统一在 Nginx 处理",
        codeSnippet: `// 当前：双重限速（Express 层从未触发）
app.use(rateLimiterV1);   // \u2190 删除此行
app.use('/api', apiRoutes);

// Nginx 配置已生效
// limit_req_zone \\$binary_remote_addr zone=api:10m rate=10r/s;`,
        checked: false,
      },
      {
        id: "lf-3",
        severity: "critical",
        category: "历史功能残留排查",
        title: "废弃数据库表：old_sessions、temp_migrations",
        location: "database/schema.sql (表定义)",
        description:
          "old_sessions 表存储旧的文件系统 session（已迁移到 Redis），temp_migrations 是 v1.5 升级时的临时表，两者均无业务代码读写。",
        impact:
          "删除后不影响功能。已通过 sqlite3 确认两表近 90 天零写入，且代码库无任何 SQL 引用。",
        action: "先备份数据，执行 DROP TABLE，清理 schema.sql 中的定义",
        codeSnippet: `-- 待删除的废弃表
DROP TABLE IF EXISTS old_sessions;      -- 上次写入：2024-01-15
DROP TABLE IF EXISTS temp_migrations;   -- 上次写入：2024-03-01

-- 验证命令
SELECT name FROM sqlite_master WHERE type='table';`,
        checked: false,
      },
      {
        id: "lf-4",
        severity: "warning",
        category: "历史功能残留排查",
        title: "废弃表字段：users.legacy_id",
        location: "database/schema.sql (users 表定义)",
        description:
          "users 表的 legacy_id 字段用于旧系统用户 ID 映射，数据迁移已于 2024-02 完成且校验无异常，当前无代码引用此字段。",
        impact:
          "删除后不影响功能。所有关联逻辑已通过新 id 字段重建，legacy_id 无任何索引或外键依赖。",
        action: "ALTER TABLE 删除列，更新 schema.sql 和模型定义",
        codeSnippet: `ALTER TABLE users DROP COLUMN legacy_id;

// 同时清理 User 模型中的字段定义
// models/User.js 第15行: legacy_id: { type: INTEGER } \u2190 删除`,
        checked: false,
      },
      {
        id: "lf-5",
        severity: "info",
        category: "历史功能残留排查",
        title: "失效的环境变量配置",
        location: ".env (第12-18行)、config/default.js (第30-35行)",
        description:
          "包含 REDIS_CLUSTER_HOSTS、MONGO_URI、AWS_S3_BUCKET 等配置项，但当前架构仅使用单机 Redis、SQLite 和本地文件存储。",
        impact:
          "删除后不影响功能。配置文件中引用的服务均未在代码中实例化。",
        action: "清理 .env 和 config 中的未使用配置项",
        codeSnippet: `# 待清理的失效配置
REDIS_CLUSTER_HOSTS=redis://cluster.example.com  # 未使用
MONGO_URI=mongodb://localhost:27017/myapp          # 未使用
AWS_S3_BUCKET=myapp-uploads                      # 未使用
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX           # 未使用`,
        checked: false,
      },
      {
        id: "lf-6",
        severity: "critical",
        category: "历史功能残留排查",
        title: "未使用的依赖包（6个）",
        location: "package.json (dependencies)",
        description:
          "mongoose、@aws-sdk/client-s3、multer-s3、ioredis、helmet@3.x、express-rate-limit 已安装但代码中未 require/import。",
        impact:
          "删除后不影响功能。已通过 depcheck 工具扫描确认零引用，且这些包未在 postinstall 等生命周期脚本中使用。",
        action: "npm uninstall mongoose @aws-sdk/client-s3 multer-s3 ioredis helmet express-rate-limit",
        codeSnippet: `$ npm uninstall mongoose @aws-sdk/client-s3 multer-s3 ioredis helmet express-rate-limit

# 验证
$ npx depcheck
# 预期输出：No unused dependencies`,
        checked: false,
      },
      {
        id: "lf-7",
        severity: "warning",
        category: "历史功能残留排查",
        title: "残留静态资源文件",
        location: "public/assets/v1/ (整个目录)",
        description:
          "public/assets/v1/ 目录包含旧版前端构建产物（CSS、JS、图片），新版前端已完全迁移到独立 CDN 部署，这些文件 90 天零访问。",
        impact:
          "删除后不影响功能。Nginx access.log 显示 v1 资源路径返回 404 或零流量。",
        action: "删除 public/assets/v1/ 目录，同步清理 Nginx 中相关 location 配置",
        codeSnippet: `# 删除命令
rm -rf public/assets/v1/

# 同时清理 Nginx 配置中的过期 location
# location /assets/v1/ { ... } \u2190 删除`,
        checked: false,
      },
      {
        id: "lf-8",
        severity: "info",
        category: "历史功能残留排查",
        title: "过期迁移脚本",
        location: "migrations/2024-01-*.js、2024-02-*.js",
        description:
          "migrations/ 目录中 2024-01 和 2024-02 的迁移脚本已合并到 schema.sql 的建表流程中，新环境部署时不再单独执行这些脚本。",
        impact:
          "删除后不影响功能。已通过对比确认 schema.sql 已包含所有迁移的表结构变更。",
        action: "迁移脚本归档到 migrations/archive/ 或删除（已受 Git 版本控制保护）",
        codeSnippet: `# 归档方式
mkdir -p migrations/archive
mv migrations/2024-01-*.js migrations/archive/
mv migrations/2024-02-*.js migrations/archive/

# 保留 migrations/ 中当前活跃脚本
# 2024-04-add-indexes.js（活跃）`,
        checked: false,
      },
    ],
  },
  {
    id: "architecture",
    title: "架构级冗余",
    description: "分析路由层、服务层和中间件层的架构设计问题",
    icon: "Layers",
    items: [
      {
        id: "ar-1",
        severity: "warning",
        category: "架构级冗余",
        title: "重复路由逻辑：3个文件上传端点",
        location: "src/routes/upload.js、src/routes/avatar.js、src/routes/documents.js",
        description:
          "三个路由文件分别实现了文件上传功能，但核心逻辑（multer 配置、文件类型校验、大小限制、错误处理）几乎完全相同。",
        impact:
          "提取后不影响功能。统一上传服务后，新增上传场景可直接复用。",
        action: "创建统一的 FileUploadService，三个路由调用同一服务",
        codeSnippet: `// upload.js - 重复逻辑
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// avatar.js - 重复逻辑
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// documents.js - 重复逻辑
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// 建议：统一为 FileUploadService`,
        checked: false,
      },
      {
        id: "ar-2",
        severity: "info",
        category: "架构级冗余",
        title: "过度封装：StringUtils 模块",
        location: "src/utils/StringUtils.js (整个文件)",
        description:
          "创建了包含 capitalize()、truncate()、slugify() 三个方法的 StringUtils 类，但每个方法仅被调用一次，且可用原生 JS / lodash 替代。",
        impact:
          "内联后不影响功能。移除单一职责的类定义，减少模块间依赖。",
        action: "删除 StringUtils 类，方法内联到调用处或使用 lodash",
        codeSnippet: `// 当前：过度封装
class StringUtils {
  static capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  static truncate(s, n) { return s.length > n ? s.slice(0, n) + '...' : s; }
  static slugify(s) { return s.toLowerCase().replace(/\\s+/g, '-'); }
}

// 建议：内联或使用 lodash
_.capitalize(str);  // lodash 已提供`,
        checked: false,
      },
      {
        id: "ar-3",
        severity: "warning",
        category: "架构级冗余",
        title: "未触发的错误处理分支",
        location: "src/middleware/errorHandler.js (第28-45行)",
        description:
          "错误处理中间件包含对 MulterError、JsonSchemaValidationError、CustomBusinessError 的分支处理，但 CustomBusinessError 类已删除，此分支永远不会执行。",
        impact:
          "删除后不影响功能。CustomBusinessError 类已于 v2.0 删除，但错误处理中间件的分支未同步清理。",
        action: "删除 CustomBusinessError 处理分支，简化错误处理逻辑",
        codeSnippet: `// 当前代码（含死分支）
if (err instanceof MulterError) {
  return res.status(400).json({ error: '文件上传失败' });
} else if (err.name === 'CustomBusinessError') {    // \u2190 永远不会触发
  return res.status(422).json({ error: err.message });
} else {
  return res.status(500).json({ error: '服务器错误' });
}`,
        checked: false,
      },
      {
        id: "ar-4",
        severity: "info",
        category: "架构级冗余",
        title: "永不执行的 EventEmitter 监听",
        location: "src/events/index.js (第12-20行)",
        description:
          "注册了 user.registered 事件监听器来发送欢迎邮件，但用户注册流程中从未触发该事件，欢迎邮件由注册控制器直接调用邮件服务发送。",
        impact:
          "删除后不影响功能。事件监听器无任何触发点，属于未完成的事件驱动重构残留。",
        action: "删除未触发的事件定义和监听器，或补全事件触发点",
        codeSnippet: `// events/index.js - 死监听器
eventEmitter.on('user.registered', async (user) => {
  await emailService.sendWelcomeEmail(user.email);
  logger.info(\\\`欢迎邮件已发送: \\\${user.email}\\\`);
});

// 但注册流程中：
// authController.js 直接调用 emailService.sendWelcomeEmail()  \u2190 未触发事件`,
        checked: false,
      },
    ],
  },
];
