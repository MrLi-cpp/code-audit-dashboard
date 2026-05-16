import type { AuditItem, ScannedFile, ScannedProject } from "@/types/audit";

const generateId = (() => {
  let counter = 0;
  return (): string => {
    counter += 1;
    return `sec-${Date.now()}-${counter}`;
  };
})();

function detectFileType(fileName: string): ScannedFile["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["js", "jsx", "mjs", "cjs"].includes(ext)) return "js";
  if (["ts", "tsx"].includes(ext)) return "ts";
  if (ext === "json") return "json";
  if (ext === "sql") return "sql";
  if (fileName === ".env" || ext === "env" || fileName.startsWith(".env.")) return "env";
  if (["html", "htm"].includes(ext)) return "other";
  return "other";
}

// ===== Scan 1: Injection — SQL Injection =====
function scanSqlInjection(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts" && file.type !== "sql") return issues;

  const lines = file.content.split("\n");
  // Pattern: string concatenation in SQL contexts
  const sqlConcatPatterns = [
    /(query|execute|exec)\s*\(\s*[`"'].*?\+.*?[`"']\s*\)/i,
    /(query|execute|exec)\s*\(\s*[`"'].*?(\$\{|\$\w+).*?[`"']\s*\)/i,
    /\bSELECT\b.*?(\$\{|\+|\$\w+).*?\bFROM\b/i,
    /\bINSERT\b.*?\bINTO\b.*?(\$\{|\+|\$\w+)/i,
    /\bUPDATE\b.*?(\$\{|\+|\$\w+).*?\bSET\b/i,
    /\.query\s*\(\s*[^,]*\+[^,]*\)/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of sqlConcatPatterns) {
      if (pattern.test(line)) {
        issues.push({
          id: generateId(),
          severity: "critical",
          category: "注入漏洞检测",
          title: `SQL 注入风险: 字符串拼接查询`,
          location: `${file.path} (第${i + 1}行)`,
          description: `第 ${i + 1} 行存在 SQL 字符串拼接，用户输入可能直接嵌入查询语句中，导致 SQL 注入攻击。`,
          impact: "攻击者可通过构造恶意输入绕过认证、读取/篡改/删除数据库数据，严重时可获取服务器控制权。",
          action: "使用参数化查询（prepared statements）或 ORM，禁止任何形式的 SQL 字符串拼接",
          codeSnippet: line.trim().slice(0, 200),
          checked: false,
          effortHours: 1.0,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Scan 2: Injection — Command Injection =====
function scanCommandInjection(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const dangerousPatterns = [
    /\b(exec|execSync|spawn|execFile)\s*\(\s*[^,)]*(\+\s*|`[^`]*\$\{)/,
    /\bchild_process\b.*\bexec\b.*\+/, /\bshelljs\b.*\bexec\b/,
    /\beval\s*\(/, /\bnew\s+Function\s*\(/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of dangerousPatterns) {
      if (pattern.test(line)) {
        const isEval = /\beval\s*\(/.test(line) || /\bnew\s+Function\s*\(/.test(line);
        issues.push({
          id: generateId(),
          severity: isEval ? "warning" : "critical",
          category: "注入漏洞检测",
          title: isEval ? `eval / new Function 使用` : `命令注入风险`,
          location: `${file.path} (第${i + 1}行)`,
          description: isEval
            ? `第 ${i + 1} 行使用了 eval 或 new Function，可能执行任意代码，属于高危反模式。`
            : `第 ${i + 1} 行通过 child_process 执行了包含变量拼接的命令，用户输入可能直接传入系统命令。`,
          impact: isEval
            ? "允许任意代码执行，攻击者可利用此漏洞执行恶意脚本、窃取数据或控制服务器。"
            : "攻击者可通过注入 shell 元字符（; | &&）执行任意系统命令，可能导致服务器被完全控制。",
          action: isEval
            ? "移除 eval / new Function，改用 JSON.parse、模板引擎或安全的数据序列化方式"
            : "使用参数数组代替字符串拼接（execFile 的 args 数组），或对输入做严格的白名单校验",
          codeSnippet: line.trim().slice(0, 200),
          checked: false,
          effortHours: 2.0,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Scan 3: Hardcoded Secrets =====
function scanHardcodedSecrets(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  const lines = file.content.split("\n");

  const secretPatterns = [
    { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["']\w{16,}["']/i, name: "API Key" },
    { pattern: /(?:secret|private[_-]?key)\s*[:=]\s*["']\w{16,}["']/i, name: "Secret Key" },
    { pattern: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{4,}["']/i, name: "Password" },
    { pattern: /(?:auth[_-]?token|access[_-]?token|bearer)\s*[:=]\s*["']\w{16,}["']/i, name: "Access Token" },
    { pattern: /sk-[a-zA-Z0-9]{32,}/, name: "OpenAI API Key" },
    { pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/, name: "GitHub Token" },
    { pattern: /AWS_ACCESS_KEY_ID\s*=\s*["']AKIA[A-Z0-9]{16}["']/, name: "AWS Access Key" },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments and test files
    if (line.trim().startsWith("//") || line.trim().startsWith("#") || line.trim().startsWith("*")) continue;
    if (file.path.includes("test") || file.path.includes("spec")) continue;

    for (const { pattern, name } of secretPatterns) {
      if (pattern.test(line)) {
        const isEnvFile = file.type === "env";
        issues.push({
          id: generateId(),
          severity: isEnvFile ? "warning" : "critical",
          category: "敏感数据泄露",
          title: `硬编码 ${name}`,
          location: `${file.path} (第${i + 1}行)`,
          description: isEnvFile
            ? `环境文件中可能包含未加密的敏感凭证。请确认这些值是否应通过密钥管理服务（KMS/Secrets Manager）注入。`
            : `第 ${i + 1} 行代码中硬编码了 ${name}，提交到版本控制后任何有权限的人都能看到。`,
          impact: "凭证泄露后攻击者可冒充应用身份、访问付费 API、读取/篡改用户数据，且更换密钥需重新部署。",
          action: "将密钥移至环境变量，使用 .env 文件（加入 .gitignore），生产环境通过 KMS/Secrets Manager 注入",
          codeSnippet: line.trim().slice(0, 200).replace(/["']\w{8,}["']/g, (_m) => `"[REDACTED]"`),
          checked: false,
          effortHours: 0.5,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Scan 4: XSS / Unsafe DOM =====
function scanXssRisks(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const xssPatterns = [
    { pattern: /\.innerHTML\s*=.*?(\+|\$\{)/, name: "innerHTML 动态赋值" },
    { pattern: /dangerouslySetInnerHTML\s*:\s*\{__html\s*:/, name: "dangerouslySetInnerHTML" },
    { pattern: /document\.write\s*\(/, name: "document.write" },
    { pattern: /\$\(.*\)\.html\s*\(.*\+/, name: "jQuery .html() 动态内容" },
    { pattern: /location\.href\s*=.*?(\+|\$\{)/, name: "location.href 动态跳转" },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { pattern, name } of xssPatterns) {
      if (pattern.test(line)) {
        issues.push({
          id: generateId(),
          severity: "critical",
          category: "前端安全检测",
          title: `XSS 风险: ${name}`,
          location: `${file.path} (第${i + 1}行)`,
          description: `第 ${i + 1} 行使用 ${name} 插入未经过滤的用户输入到 DOM，可能导致跨站脚本攻击（XSS）。`,
          impact: "攻击者可注入恶意脚本（窃取 Cookie、会话劫持、钓鱼、挖矿），影响所有访问该页面的用户。",
          action: "使用 textContent 代替 innerHTML；React 使用默认转义；对必须插入的 HTML 使用 DOMPurify 净化后再渲染",
          codeSnippet: line.trim().slice(0, 200),
          checked: false,
          effortHours: 1.0,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Scan 5: CSRF / Missing Protection =====
function scanCsrfProtection(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const content = file.content;
  const hasCsrf = content.includes("csurf") || content.includes("csrf") ||
    content.includes("csrf-token") || content.includes("xsrf") ||
    content.includes("SameSite");

  // Check for state-changing routes without CSRF protection
  const stateChangePatterns = [
    /app\.(post|put|delete|patch)\s*\(/g,
    /router\.(post|put|delete|patch)\s*\(/g,
  ];

  let stateChangeCount = 0;
  for (const pattern of stateChangePatterns) {
    const matches = content.match(pattern);
    if (matches) stateChangeCount += matches.length;
  }

  if (stateChangeCount > 0 && !hasCsrf) {
    issues.push({
      id: generateId(),
      severity: stateChangeCount > 5 ? "critical" : "warning",
      category: "认证与授权检测",
      title: `CSRF 防护缺失: ${stateChangeCount} 个状态变更路由`,
      location: `${file.path}`,
      description: `检测到 ${stateChangeCount} 个 POST/PUT/DELETE/PATCH 路由，但未发现 CSRF 防护中间件（csurf、csrf-token、SameSite Cookie 等）。`,
      impact: "攻击者可构造恶意页面诱导已登录用户执行非预期操作（转账、改密码、删除数据）。",
      action: "安装 csurf 中间件并验证 CSRF token；或设置 Cookie SameSite=Strict/Lax；或验证 Origin/Referer 头",
      codeSnippet: `// 检测到 ${stateChangeCount} 个状态变更路由\n// 建议添加: app.use(csurf({ cookie: true }))`,
      checked: false,
      effortHours: 1.5,
    });
  }
  return issues;
}

// ===== Scan 6: CORS Misconfiguration =====
function scanCorsConfig(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/origin\s*:\s*\*\s*[,}]/.test(line) || /\.cors\s*\(\s*\{[^}]*origin\s*:\s*true/.test(line) ||
        /Access-Control-Allow-Origin\s*:\s*\*/.test(line)) {
      issues.push({
        id: generateId(),
        severity: "warning",
        category: "认证与授权检测",
        title: `CORS 配置过于宽松`,
        location: `${file.path} (第${i + 1}行)`,
        description: `CORS 设置为允许任意来源（origin: * 或 origin: true），任何网站都可跨域调用该 API。`,
        impact: "配合 Cookie 会话机制时，攻击者网站可发起认证过的跨域请求（Credentialed CORS），窃取或篡改用户数据。",
        action: "将 CORS origin 白名单化至具体域名列表，生产环境禁止使用 *",
        codeSnippet: line.trim().slice(0, 200),
        checked: false,
        effortHours: 0.5,
      });
    }
    if (/credentials\s*:\s*true[^}]*origin\s*:\s*\*/.test(line) ||
        /origin\s*:\s*\*[^}]*credentials\s*:\s*true/.test(line)) {
      issues.push({
        id: generateId(),
        severity: "critical",
        category: "认证与授权检测",
        title: `危险 CORS 配置: credentials + 任意 origin`,
        location: `${file.path} (第${i + 1}行)`,
        description: `CORS 同时开启了 credentials: true 和 origin: *，这是浏览器规范禁止的组合，实际效果相当于允许任意来源携带 Cookie 访问。`,
        impact: "任意网站可冒充已登录用户发起请求，等同于完全开放跨域权限，是最危险的 CORS 配置。",
        action: "立即移除 credentials: true 和 origin: * 的组合，使用白名单域名 + credentials: true，或禁用 credentials",
        codeSnippet: line.trim().slice(0, 200),
        checked: false,
        effortHours: 0.5,
      });
    }
  }
  return issues;
}

// ===== Scan 7: Unsafe File Upload =====
function scanFileUpload(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/multer|upload|formidable|busboy/.test(line) && !/mimetype|extname|whitelist|allowed/i.test(line)) {
      // Check if this file has any validation at all
      const hasValidation = file.content.match(/mimetype|extname|whitelist|allowed|mime|extension/i);
      if (!hasValidation) {
        issues.push({
          id: generateId(),
          severity: "critical",
          category: "文件与路径安全",
          title: `文件上传缺少验证`,
          location: `${file.path} (第${i + 1}行)`,
          description: `检测到文件上传处理代码（multer / formidable / busboy），但未发现 MIME 类型、扩展名或文件内容校验逻辑。`,
          impact: "攻击者可上传任意文件（如 .php、.jsp、可执行文件），通过访问上传目录执行恶意代码获取服务器控制权。",
          action: "验证 MIME 类型白名单 + 扩展名白名单 + 文件头魔数校验；重命名上传文件（避免保留原始扩展名）；存储目录禁止执行权限",
          codeSnippet: line.trim().slice(0, 200),
          checked: false,
          effortHours: 2.0,
        });
        return issues; // Only flag once per file
      }
    }
  }
  return issues;
}

// ===== Scan 8: Path Traversal =====
function scanPathTraversal(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const traversalPatterns = [
    /fs\.(readFile|writeFile|createReadStream|createWriteStream)\s*\(\s*[^,)]*(req\.(body|query|params)|\+)/,
    /res\.sendFile\s*\(\s*[^,)]*(req\.(body|query|params)|\+)/,
    /path\.join\s*\(.*req\.(body|query|params)/,
    /\.sendFile\s*\(.*\+.*req/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of traversalPatterns) {
      if (pattern.test(line)) {
        issues.push({
          id: generateId(),
          severity: "critical",
          category: "文件与路径安全",
          title: `路径遍历风险`,
          location: `${file.path} (第${i + 1}行)`,
          description: `第 ${i + 1} 行使用用户输入拼接文件路径，未做路径规范化处理，攻击者可用 ../ 访问任意系统文件。`,
          impact: "攻击者可读取服务器敏感文件（/etc/passwd、数据库文件、源码、私钥），或写入文件覆盖系统配置。",
          action: "使用 path.resolve + path.normalize 限制在基目录内；或预定义白名单文件映射；禁止直接使用用户输入作为路径",
          codeSnippet: line.trim().slice(0, 200),
          checked: false,
          effortHours: 1.0,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Scan 9: Insecure Authentication =====
function scanAuthIssues(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const content = file.content;

  // Check for bcrypt/scrypt/argon2 usage
  const hasStrongHash = /bcrypt|scrypt|argon2|pbkdf2/.test(content);
  const hasPassword = /password|passwd|pwd/i.test(content);

  if (hasPassword && !hasStrongHash && content.includes("hash") && !content.includes("crypto.createHash")) {
    issues.push({
      id: generateId(),
      severity: "critical",
      category: "认证与授权检测",
      title: `密码哈希强度不足`,
      location: `${file.path}`,
      description: `检测到密码处理逻辑，但未使用 bcrypt、scrypt、argon2 等慢哈希算法。可能使用了 MD5/SHA1 或简单哈希。`,
      impact: "弱哈希（MD5/SHA1/简单哈希）可在数小时内被彩虹表/暴力破解，用户密码泄露后导致大规模账户被盗。",
      action: "使用 bcrypt（cost factor ≥ 12）、scrypt 或 argon2id 进行密码哈希，禁止 MD5/SHA1/SHA256 用于密码",
      codeSnippet: `// 建议: const bcrypt = require('bcrypt');\n// const hash = await bcrypt.hash(password, 12);`,
      checked: false,
      effortHours: 2.0,
    });
  }

  // Check for JWT without expiration
  if (content.includes("jwt.sign") && !content.includes("expiresIn")) {
    const lineIdx = lines.findIndex(l => l.includes("jwt.sign"));
    issues.push({
      id: generateId(),
      severity: "warning",
      category: "认证与授权检测",
      title: `JWT 令牌缺少过期时间`,
      location: `${file.path} (第${lineIdx + 1}行)`,
      description: `使用 jwt.sign 签发令牌时未设置 expiresIn，令牌永久有效，泄露后攻击者可无限期冒充用户。`,
      impact: "JWT 一旦泄露无法撤销（除非维护黑名单），永久有效令牌意味着泄露即永久失陷。",
      action: "设置 expiresIn（如 '15m'、'1h'），配合 refresh token 机制；生产环境实现 token 黑名单或短期有效期",
      codeSnippet: lineIdx >= 0 ? lines[lineIdx].trim().slice(0, 200) : "jwt.sign(payload, secret)",
      checked: false,
      effortHours: 1.0,
    });
  }

  return issues;
}

// ===== Scan 10: Dependency Security =====
function scanDependencySecurity(files: ScannedFile[]): AuditItem[] {
  const issues: AuditItem[] = [];
  const pkgFile = files.find((f) => f.name === "package.json");
  if (!pkgFile) return issues;

  try {
    const pkg = JSON.parse(pkgFile.content);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const knownVulnerable = [
      { pkg: "lodash", reason: "旧版本存在原型污染漏洞 (CVE-2019-10744)", severity: "warning" as const },
      { pkg: "jquery", reason: "旧版本存在 XSS 漏洞 (CVE-2020-11022 等)", severity: "warning" as const },
      { pkg: "express", reason: "版本 < 4.17.3 存在 qs 原型污染漏洞", severity: "warning" as const },
      { pkg: "axios", reason: "旧版本存在 SSRF / 重定向漏洞", severity: "info" as const },
      { pkg: "serialize-javascript", reason: "旧版本存在 XSS 漏洞", severity: "warning" as const },
      { pkg: "ejs", reason: "旧版本存在代码执行漏洞", severity: "critical" as const },
      { pkg: "handlebars", reason: "旧版本存在原型污染/代码执行漏洞", severity: "warning" as const },
      { pkg: "minimist", reason: "旧版本存在原型污染漏洞", severity: "warning" as const },
      { pkg: "mysql", reason: "mysql 驱动存在 SQL 注入风险（字符串拼接时），建议使用 mysql2", severity: "info" as const },
    ];

    for (const depName of Object.keys(deps)) {
      for (const { pkg: vulnPkg, reason, severity } of knownVulnerable) {
        if (depName.toLowerCase() === vulnPkg.toLowerCase()) {
          const version = deps[depName as keyof typeof deps] as string;
          issues.push({
            id: generateId(),
            severity,
            category: "依赖与供应链安全",
            title: `依赖安全风险: ${depName}`,
            location: `package.json (dependencies)`,
            description: `"${depName}" 为已知存在安全漏洞的依赖包。${reason}。当前版本: ${version}。`,
            impact: "漏洞依赖可能导致应用被利用，攻击者可通过依赖链入侵应用。",
            action: `运行 npm audit 确认具体漏洞版本，升级至最新安全版本；或使用 npm audit fix --force（需回归测试）`,
            codeSnippet: `"${depName}": "${version}"`,
            checked: false,
            effortHours: 0.5,
          });
        }
      }
    }
  } catch {
    // Invalid package.json
  }

  return issues;
}

// ===== Scan 11: Insecure Headers / Missing Helmet =====
function scanSecurityHeaders(files: ScannedFile[]): AuditItem[] {
  const issues: AuditItem[] = [];
  const jsFiles = files.filter((f) => f.type === "js" || f.type === "ts");
  const allContent = jsFiles.map((f) => f.content).join("\n");

  const hasHelmet = allContent.includes("helmet") || allContent.includes("helmet(");
  const hasCsp = allContent.includes("Content-Security-Policy") || allContent.includes("csp");
  const hasHsts = allContent.includes("Strict-Transport-Security") || allContent.includes("hsts");
  const hasXFrame = allContent.includes("X-Frame-Options") || allContent.includes("frameguard");

  if (!hasHelmet && !hasCsp && !hasHsts && !hasXFrame) {
    // Find the main app file (likely has app.listen or app.use)
    const appFile = jsFiles.find((f) => f.content.includes("app.listen") || f.content.includes("createServer"));
    if (appFile) {
      issues.push({
        id: generateId(),
        severity: "warning",
        category: "部署与运行时安全",
        title: `安全响应头缺失`,
        location: `${appFile.path}`,
        description: `未检测到安全响应头中间件（helmet、CSP、HSTS、X-Frame-Options），应用缺少基础 HTTP 安全头防护。`,
        impact: "缺少 CSP 可导致 XSS；缺少 X-Frame-Options 可导致点击劫持；缺少 HSTS 可导致中间人降级攻击。",
        action: "安装 helmet 中间件：app.use(helmet())；或手动设置 CSP、HSTS、X-Frame-Options、X-Content-Type-Options 等响应头",
        codeSnippet: `// 建议添加\nconst helmet = require('helmet');\napp.use(helmet());`,
        checked: false,
        effortHours: 0.5,
      });
    }
  }

  return issues;
}

// ===== Scan 12: ReDoS — Regular Expression DoS =====
function scanRedos(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const redosPatterns = [
    /\(.*\+.*\)\*|\(.*\*.*\)\+|\(.*\+.*\)\+|\(.*\*.*\)\*/, // (a+)* or (a*)+
    /\(.*\|.*\)\+.*\(.*\|.*\)/, // Alternation with repetition
    /\w*\+.*\w*\*|\w*\*.*\w*\+/, // Word char repetition
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("RegExp") && !line.includes("match(") && !line.includes("test(") && !line.includes("replace(")) continue;

    for (const pattern of redosPatterns) {
      if (pattern.test(line)) {
        issues.push({
          id: generateId(),
          severity: "warning",
          category: "性能与拒绝服务",
          title: `正则表达式拒绝服务 (ReDoS) 风险`,
          location: `${file.path} (第${i + 1}行)`,
          description: `第 ${i + 1} 行的正则表达式包含嵌套量词（如 (a+)*）或回溯结构，恶意输入可导致 CPU 耗尽。`,
          impact: "攻击者构造特定输入使正则引擎进入指数级回溯，单条请求即可耗尽 CPU 资源，导致服务拒绝。",
          action: "重构正则避免嵌套量词；使用非回溯引擎（如 re2）；限制输入长度；对正则匹配设置超时",
          codeSnippet: line.trim().slice(0, 200),
          checked: false,
          effortHours: 1.0,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Scan 13: Debug / Console in Production =====
function scanDebugStatements(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  // Skip test files
  if (file.path.includes("test") || file.path.includes("spec")) return issues;

  const lines = file.content.split("\n");
  let consoleCount = 0;
  let hasDebugger = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/console\.(log|warn|error|debug|info)\s*\(/.test(line) && !line.trim().startsWith("//")) {
      consoleCount++;
    }
    if (/\bdebugger\b/.test(line) && !line.trim().startsWith("//")) {
      hasDebugger = true;
    }
  }

  if (consoleCount > 5) {
    issues.push({
      id: generateId(),
      severity: "info",
      category: "部署与运行时安全",
      title: `生产环境 console 输出过多 (${consoleCount} 处)`,
      location: `${file.path}`,
      description: `检测到 ${consoleCount} 处 console.log/warn/error/debug，生产环境输出日志可能泄露敏感信息（对象内部结构、密钥片段）。`,
      impact: "console 输出可能被浏览器开发者工具、日志收集系统捕获，泄露内部数据结构、用户隐私、甚至密钥片段。",
      action: "生产环境禁用 console：使用 eslint-plugin-no-console；或替换为 winston/pino 等结构化日志库，并配置日志级别过滤",
      codeSnippet: `// 共 ${consoleCount} 处 console 调用\n// 建议使用: const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });`,
      checked: false,
      effortHours: 1.0,
    });
  }

  if (hasDebugger) {
    issues.push({
      id: generateId(),
      severity: "warning",
      category: "部署与运行时安全",
      title: `debugger 语句残留`,
      location: `${file.path}`,
      description: `检测到 debugger 语句残留，生产环境下可能中断代码执行流程，暴露调试接口。`,
      impact: "debugger 可在特定浏览器/Node 环境下触发断点，攻击者可能利用调试信息获取内部状态。",
      action: "移除所有 debugger 语句，在 CI 中添加 ESLint no-debugger 规则，构建时启用 terser drop_debugger",
      codeSnippet: `debugger; // ← 移除此行`,
      checked: false,
      effortHours: 0.25,
    });
  }

  return issues;
}

// ===== Scan 14: Sensitive Data in Logs =====
function scanSensitiveLogging(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const sensitivePatterns = [
    /console\.(log|warn|error|debug|info)\s*\(.*?(password|secret|token|key|auth|credential)/i,
    /console\.(log|warn|error|debug|info)\s*\(.*?(req\.body|req\.user|user\.password)/i,
    /logger\.(info|debug|warn|error)\s*\(.*?(password|secret|token|key)/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of sensitivePatterns) {
      if (pattern.test(line) && !line.trim().startsWith("//")) {
        issues.push({
          id: generateId(),
          severity: "warning",
          category: "敏感数据泄露",
          title: `日志输出包含敏感数据`,
          location: `${file.path} (第${i + 1}行)`,
          description: `第 ${i + 1} 行的日志输出中包含 password、secret、token 或完整请求体，可能导致敏感数据泄露到日志系统。`,
          impact: "日志系统通常权限较低、保留时间长、可被多个服务访问，日志中的密钥/密码泄露后果等同于代码硬编码。",
          action: "日志输出前对敏感字段做脱敏处理（如 password: '***'）；或使用结构化日志的 redact 配置自动屏蔽",
          codeSnippet: line.trim().slice(0, 200).replace(/password[^,)]*/gi, "password: '[REDACTED]'"),
          checked: false,
          effortHours: 0.5,
        });
        break;
      }
    }
  }
  return issues;
}

// ===== Main Scan Function =====
export async function scanSecurity(files: FileList): Promise<ScannedProject> {
  const scannedFiles: ScannedFile[] = [];
  let totalLines = 0;
  let jsFiles = 0;
  let jsonFiles = 0;
  let sqlFiles = 0;
  let envFiles = 0;
  let otherFiles = 0;

  const fileArray = Array.from(files);
  for (const file of fileArray) {
    const filePath = file.webkitRelativePath || file.name;
    if (
      filePath.includes("node_modules/") ||
      filePath.includes(".git/") ||
      file.name.endsWith(".lock") ||
      file.name.endsWith(".log") ||
      [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot"].some((ext) => file.name.endsWith(ext))
    ) {
      continue;
    }

    try {
      const content = await file.text();
      const type = detectFileType(file.name);
      const lineCount = content.split("\n").length;
      totalLines += lineCount;

      if (type === "js" || type === "ts") jsFiles++;
      else if (type === "json") jsonFiles++;
      else if (type === "sql") sqlFiles++;
      else if (type === "env") envFiles++;
      else otherFiles++;

      scannedFiles.push({
        name: file.name,
        path: filePath,
        content,
        type,
        size: file.size,
      });
    } catch {
      // Skip unreadable
    }
  }

  const allIssues: AuditItem[] = [];

  for (const file of scannedFiles) {
    allIssues.push(...scanSqlInjection(file));
    allIssues.push(...scanCommandInjection(file));
    allIssues.push(...scanHardcodedSecrets(file));
    allIssues.push(...scanXssRisks(file));
    allIssues.push(...scanCsrfProtection(file));
    allIssues.push(...scanCorsConfig(file));
    allIssues.push(...scanFileUpload(file));
    allIssues.push(...scanPathTraversal(file));
    allIssues.push(...scanAuthIssues(file));
    allIssues.push(...scanRedos(file));
    allIssues.push(...scanDebugStatements(file));
    allIssues.push(...scanSensitiveLogging(file));
  }

  allIssues.push(...scanDependencySecurity(scannedFiles));
  allIssues.push(...scanSecurityHeaders(scannedFiles));

  // Deduplicate
  const seen = new Set<string>();
  const uniqueIssues = allIssues.filter((issue) => {
    const key = `${issue.title}|${issue.location}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const projectName =
    fileArray.length > 0
      ? fileArray[0].webkitRelativePath.split("/")[0] || "Unknown Project"
      : "Unknown Project";

  return {
    projectName,
    files: scannedFiles,
    totalFiles: scannedFiles.length,
    issues: uniqueIssues,
    complexity: {
      totalCyclomatic: 0,
      avgPerFile: 0,
      filesAnalyzed: 0,
      commentCoverage: 0,
    },
    stats: {
      totalLines,
      jsFiles,
      jsonFiles,
      sqlFiles,
      envFiles,
      otherFiles,
    },
  };
}

export const SECURITY_SCAN_STEPS = [
  { name: "读取文件列表", duration: 400 },
  { name: "解析 JS/TS 源码", duration: 600 },
  { name: "检测 SQL 注入", duration: 700 },
  { name: "检测命令注入与 eval", duration: 600 },
  { name: "扫描硬编码密钥", duration: 500 },
  { name: "检测 XSS 风险", duration: 600 },
  { name: "检测 CSRF 防护缺失", duration: 500 },
  { name: "检测 CORS 配置问题", duration: 500 },
  { name: "检测文件上传安全", duration: 500 },
  { name: "检测路径遍历", duration: 500 },
  { name: "检测认证安全", duration: 600 },
  { name: "检测 ReDoS 正则", duration: 400 },
  { name: "检测依赖安全", duration: 500 },
  { name: "检测安全响应头", duration: 400 },
  { name: "检测敏感日志输出", duration: 400 },
  { name: "去重与结果汇总", duration: 300 },
];
