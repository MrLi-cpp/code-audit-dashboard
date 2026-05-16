import type { AuditItem, ScannedFile, ScannedProject, FileComplexity } from "@/types/audit";
export type { ScannedProject };

let scanIdCounter = 0;

function generateId(): string {
  scanIdCounter += 1;
  return `scan-${Date.now()}-${scanIdCounter}`;
}

function detectFileType(fileName: string): ScannedFile["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["js", "jsx", "mjs", "cjs"].includes(ext)) return "js";
  if (["ts", "tsx"].includes(ext)) return "ts";
  if (ext === "json") return "json";
  if (ext === "sql") return "sql";
  if (fileName === ".env" || ext === "env" || fileName.startsWith(".env.")) return "env";
  return "other";
}

// ===== Complexity Analysis =====
function calculateComplexity(content: string, filePath: string): FileComplexity {
  const lines = content.split("\n");
  let cyclomatic = 1; // base
  let functionCount = 0;
  let commentLines = 0;
  let inBlockComment = false;

  // Branch keywords that increase cyclomatic complexity
  const branchKeywords = /\b(if|else\s*if|while|for|switch|case|catch|\?\s*:|\|\||&&)\b/g;
  // Function declarations
  const funcRegex = /\b(function\s+\w+|\([^)]*\)\s*=>|\b\w+\s*:\s*function\s*\(|\b\w+\s*=\s*(async\s*)?function\s*\()/g;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Count branch points
    const branches = trimmed.match(branchKeywords);
    if (branches) cyclomatic += branches.length;

    // Count functions
    if (funcRegex.test(trimmed)) functionCount++;

    // Count comments
    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes("*/")) inBlockComment = false;
    } else if (trimmed.startsWith("//")) {
      commentLines++;
    } else if (trimmed.startsWith("/*")) {
      commentLines++;
      if (!trimmed.includes("*/")) inBlockComment = true;
    }
  }

  const totalLines = lines.filter((l) => l.trim()).length;
  const commentRatio = totalLines > 0 ? commentLines / totalLines : 0;

  return {
    path: filePath,
    cyclomaticComplexity: cyclomatic,
    functionCount: Math.max(functionCount, 1),
    avgFunctionComplexity: Math.round((cyclomatic / Math.max(functionCount, 1)) * 10) / 10,
    lines: totalLines,
    commentRatio: Math.round(commentRatio * 100) / 100,
  };
}

// Scan 1: Unused imports
function scanUnusedImports(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const importRegex = /(?:const|let|var)\s+(\{[^}]+\}|\w+)\s+=\s+require\(['"]([^'"]+)['"]\)/g;
  const destructuringRegex = /\{([^}]+)\}/;
  const allImports: { names: string[]; module: string; line: number }[] = [];

  lines.forEach((line, idx) => {
    importRegex.lastIndex = 0;
    const match = importRegex.exec(line);
    if (match) {
      const binding = match[1].trim();
      const moduleName = match[2];
      const destructMatch = destructuringRegex.exec(binding);
      if (destructMatch) {
        const names = destructMatch[1].split(",").map((n) => n.trim().split(/\s*:\s*/)[0].trim());
        allImports.push({ names, module: moduleName, line: idx + 1 });
      } else {
        allImports.push({ names: [binding], module: moduleName, line: idx + 1 });
      }
    }
  });

  const es6ImportRegex = /import\s+(?:(\{[^}]+\})|(\w+)|\*\s+as\s+(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  lines.forEach((line, idx) => {
    es6ImportRegex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = es6ImportRegex.exec(line)) !== null) {
      const destructured = m[1];
      const defaultImport = m[2];
      const namespaceImport = m[3];
      const moduleName = m[4];
      const names: string[] = [];
      if (destructured) {
        names.push(...destructured.replace(/[{}]/g, "").split(",").map((n) => n.trim().split(/\s*as\s*/).pop()?.trim() || ""));
      }
      if (defaultImport) names.push(defaultImport);
      if (namespaceImport) names.push(namespaceImport);
      allImports.push({ names, module: moduleName, line: idx + 1 });
    }
  });

  for (const imp of allImports) {
    for (const name of imp.names) {
      if (!name) continue;
      let used = false;
      lines.forEach((line, idx) => {
        if (idx === imp.line - 1) return;
        const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
        if (regex.test(line)) used = true;
      });
      if (!used) {
        issues.push({
          id: generateId(),
          severity: "warning",
          category: "冗余代码检测",
          title: `未使用的导入: "${name}"`,
          location: `${file.path} (第${imp.line}行)`,
          description: `从模块 "${imp.module}" 导入了 "${name}"，但在文件的其余部分无任何引用。`,
          impact: "删除后不影响功能。该导入在当前文件中为零引用。",
          action: "直接从 import/require 语句中删除未使用的导入项",
          codeSnippet: lines.slice(Math.max(0, imp.line - 2), imp.line + 1).join("\n").slice(0, 300) || `// 第${imp.line}行: 未使用的导入 "${name}"`,
          checked: false,
          effortHours: 0.25,
        });
      }
    }
  }

  return issues;
}

// Scan 2: Commented out code blocks
function scanCommentedCode(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts" && file.type !== "sql") return issues;

  const lines = file.content.split("\n");
  let commentBlockStart = -1;
  let commentBlockLines: string[] = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("/*") && !line.endsWith("*/")) {
      inBlockComment = true;
      commentBlockStart = i;
      commentBlockLines = [line];
      continue;
    }
    if (inBlockComment) {
      commentBlockLines.push(line);
      if (line.endsWith("*/")) {
        inBlockComment = false;
        const blockContent = commentBlockLines.join("\n");
        if (
          blockContent.includes("(") &&
          blockContent.includes(")") &&
          (blockContent.includes("const ") ||
            blockContent.includes("function") ||
            blockContent.includes("app.use") ||
            blockContent.includes("require("))
        ) {
          issues.push({
            id: generateId(),
            severity: "info",
            category: "冗余代码检测",
            title: "注释掉的代码块",
            location: `${file.path} (第${commentBlockStart + 1}-${i + 1}行)`,
            description: `发现被注释掉的代码块，包含 ${commentBlockLines.length} 行。其中可能包含函数定义、路由注册或模块导入等可执行代码。`,
            impact: "删除后不影响功能。注释代码已被 Git 历史保存，保留在源码中增加维护成本。",
            action: "评估后删除，如需恢复可从 Git history 检出",
            codeSnippet: blockContent.slice(0, 400) + (blockContent.length > 400 ? "..." : ""),
            checked: false,
            effortHours: 0.5,
          });
        }
        commentBlockLines = [];
      }
      continue;
    }
    if (line.startsWith("//") && line.length > 5) {
      const codePart = line.slice(2).trim();
      if (
        (codePart.includes("const ") || codePart.includes("let ") || codePart.includes("var ")) &&
        codePart.includes("=")
      ) {
        if (!codePart.includes("@") && !codePart.startsWith("NOTE") && !codePart.startsWith("TODO")) {
          issues.push({
            id: generateId(),
            severity: "info",
            category: "冗余代码检测",
            title: "单行注释代码",
            location: `${file.path} (第${i + 1}行)`,
            description: `第 ${i + 1} 行包含被注释掉的变量声明或赋值语句。`,
            impact: "删除后不影响功能。",
            action: "删除注释掉的单行代码",
            codeSnippet: line,
            checked: false,
            effortHours: 0.25,
          });
        }
      }
    }
  }

  return issues;
}

// Scan 3: Dead functions
function scanDeadFunctions(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const functionRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function\s*\())/g;
  const lines = file.content.split("\n");
  const functions: { name: string; line: number }[] = [];

  lines.forEach((line, idx) => {
    functionRegex.lastIndex = 0;
    const match = functionRegex.exec(line);
    if (match) {
      const name = match[1] || match[2];
      if (name && !name.startsWith("_") && name !== "main" && name !== "app") {
        functions.push({ name, line: idx + 1 });
      }
    }
  });

  for (const fn of functions) {
    const callRegex = new RegExp(`\\b${fn.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g");
    let called = false;
    lines.forEach((line, idx) => {
      if (idx === fn.line - 1) return;
      callRegex.lastIndex = 0;
      if (callRegex.test(line)) called = true;
    });

    const isExported = lines.some((line) => {
      return (
        line.includes(`module.exports.${fn.name}`) ||
        line.includes(`exports.${fn.name}`) ||
        line.includes(`export { ${fn.name} }`) ||
        line.includes(`export const ${fn.name}`) ||
        line.includes(`export function ${fn.name}`)
      );
    });

    if (!called && !isExported) {
      issues.push({
        id: generateId(),
        severity: "critical",
        category: "冗余代码检测",
        title: `死函数: ${fn.name}()`,
        location: `${file.path} (第${fn.line}行)`,
        description: `函数 "${fn.name}" 在当前文件内被定义但未被任何代码调用，也未被导出供外部使用。`,
        impact: "删除后不影响功能。该函数为零引用函数。",
        action: "直接删除该函数及其注释文档",
        codeSnippet:
          lines.slice(Math.max(0, fn.line - 1), Math.min(lines.length, fn.line + 4)).join("\n").slice(0, 300) ||
          `// 第${fn.line}行: 死函数 "${fn.name}"`,
        checked: false,
        effortHours: 0.5,
      });
    }
  }

  return issues;
}

// Scan 4: Magic numbers
function scanMagicNumbers(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const lines = file.content.split("\n");
  const magicRegex = /[^\w.](\d{3,}|\d{1,2})[^\w]/g;
  const allowed = ["0", "1", "-1", "2", "100"];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    magicRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    const found = new Set<string>();

    while ((match = magicRegex.exec(line)) !== null) {
      const num = match[1];
      if (allowed.includes(num)) continue;
      // Skip if part of array index, timestamp, or date
      const ctx = line.slice(Math.max(0, match.index - 5), match.index + 5);
      if (ctx.includes("[") || ctx.includes("]")) continue;
      if (/\d{4}-\d{2}-\d{2}/.test(ctx) || /\d{2}:\d{2}/.test(ctx)) continue;
      if (found.has(num)) continue;
      found.add(num);

      issues.push({
        id: generateId(),
        severity: "notice",
        category: "变量与常量审计",
        title: `幻数: ${num}`,
        location: `${file.path} (第${i + 1}行)`,
        description: `发现未命名的字面量数值 "${num}"，建议提取为具名常量以提高可读性和可维护性。`,
        impact: "不影响功能，但增加代码理解成本。修改为命名常量后不影响任何行为。",
        action: "提取为 const 常量，如 const MAX_RETRY = 5",
        codeSnippet: line.trim().slice(0, 120),
        checked: false,
        effortHours: 0.25,
      });
    }
  }

  return issues.slice(0, 5); // Limit to avoid noise
}

// Scan 5: Low comment coverage
function scanLowCommentCoverage(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const complexity = calculateComplexity(file.content, file.path);
  if (complexity.commentRatio < 0.05 && complexity.lines > 50) {
    issues.push({
      id: generateId(),
      severity: "notice",
      category: "文档与注释审计",
      title: "注释覆盖率偏低",
      location: `${file.path} (${complexity.lines} 行)`,
      description: `文件注释覆盖率仅 ${Math.round(complexity.commentRatio * 100)}%，低于建议的 5% 阈值（${complexity.lines} 行代码中仅约 ${Math.round(complexity.lines * complexity.commentRatio)} 行注释）。`,
      impact: "不影响功能，但增加后续维护成本。新人理解代码难度增加。",
      action: "为公共函数添加 JSDoc 注释，为复杂逻辑添加行内注释",
      codeSnippet: `// 当前注释覆盖率: ${Math.round(complexity.commentRatio * 100)}%`,
      checked: false,
      complexity: Math.round(complexity.commentRatio * 100),
      effortHours: 1.0,
    });
  }

  return issues;
}

// Scan 6: High cyclomatic complexity
function scanHighComplexity(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const complexity = calculateComplexity(file.content, file.path);
  if (complexity.cyclomaticComplexity > 15) {
    issues.push({
      id: generateId(),
      severity: "warning",
      category: "复杂度审计",
      title: `高圈复杂度: ${complexity.cyclomaticComplexity}`,
      location: `${file.path} (${complexity.functionCount} 个函数)`,
      description: `文件圈复杂度为 ${complexity.cyclomaticComplexity}，超出建议阈值 15。平均每函数复杂度 ${complexity.avgFunctionComplexity}。`,
      impact: "不影响功能，但增加测试覆盖难度和 bug 引入风险。高复杂度模块通常难以维护。",
      action: "提取子函数、简化条件分支、使用策略模式替代冗长 if-else 链",
      codeSnippet: `// 圈复杂度: ${complexity.cyclomaticComplexity}\n// 函数数: ${complexity.functionCount}\n// 平均复杂度: ${complexity.avgFunctionComplexity}`,
      checked: false,
      complexity: complexity.cyclomaticComplexity,
      effortHours: 2.0,
    });
  }

  return issues;
}

// Scan 7: Unused dependencies
function scanUnusedDependencies(files: ScannedFile[]): AuditItem[] {
  const issues: AuditItem[] = [];
  const pkgFile = files.find((f) => f.name === "package.json");
  if (!pkgFile) return issues;

  try {
    const pkg = JSON.parse(pkgFile.content);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const allCode = files
      .filter((f) => f.type === "js" || f.type === "ts")
      .map((f) => f.content)
      .join("\n");

    for (const [depName] of Object.entries(deps)) {
      const importPatterns = [
        new RegExp(`require\\s*\\(\\s*['"]${depName}['"]\\s*\\)`),
        new RegExp(`require\\s*\\(\\s*['"]${depName}/[^'"]*['"]\\s*\\)`),
        new RegExp(`import\\s+.*?\\s+from\\s+['"]${depName}['"]`),
        new RegExp(`import\\s+.*?\\s+from\\s+['"]${depName}/[^'"]*['"]`),
      ];

      const isUsed = importPatterns.some((pattern) => pattern.test(allCode));

      if (!isUsed) {
        const implicitDeps = [
          "typescript", "@types", "eslint", "prettier", "jest", "mocha",
          "nodemon", "ts-node", "vite", "webpack", "parcel", "rollup",
        ];
        const isImplicit = implicitDeps.some((id) => depName.includes(id));
        if (!isImplicit) {
          issues.push({
            id: generateId(),
            severity: "critical",
            category: "历史功能残留排查",
            title: `未使用的依赖包: ${depName}`,
            location: "package.json (dependencies)",
            description: `"${depName}" 在 package.json 中声明，但在所有 JS/TS 文件中均未发现 import 或 require 引用。`,
            impact: "删除后不影响功能。depcheck 扫描确认零引用。",
            action: `npm uninstall ${depName}`,
            codeSnippet: `"${depName}": "${(deps as Record<string, string>)[depName]}"`,
            checked: false,
            effortHours: 0.25,
          });
        }
      }
    }
  } catch {
    // Invalid package.json
  }

  return issues;
}

// Scan 8: Environment variables
function scanEnvFiles(files: ScannedFile[]): AuditItem[] {
  const issues: AuditItem[] = [];
  const envFiles = files.filter((f) => f.type === "env");
  const jsFiles = files.filter((f) => f.type === "js" || f.type === "ts");

  for (const envFile of envFiles) {
    const lines = envFile.content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      if (!key) continue;

      const isUsed = jsFiles.some((f) => {
        return (
          f.content.includes(`process.env.${key}`) ||
          f.content.includes(`process.env["${key}"]`) ||
          f.content.includes(`process.env['${key}']`)
        );
      });

      if (!isUsed) {
        issues.push({
          id: generateId(),
          severity: "info",
          category: "历史功能残留排查",
          title: `未使用的环境变量: ${key}`,
          location: `${envFile.path}`,
          description: `环境变量 "${key}" 在配置文件中定义，但在所有代码文件中均未通过 process.env 引用。`,
          impact: "删除后不影响功能。",
          action: "清理 .env 和 config 中的未使用配置项",
          codeSnippet: `${key}=${trimmed.slice(eqIdx + 1)}`,
          checked: false,
          effortHours: 0.25,
        });
      }
    }
  }

  return issues;
}

// Scan 9: Duplicate SQL logic
function scanDuplicateLogic(files: ScannedFile[]): AuditItem[] {
  const issues: AuditItem[] = [];
  const sqlPatterns: { sql: string; files: string[]; lines: number[] }[] = [];

  for (const file of files) {
    if (file.type !== "js" && file.type !== "ts") continue;
    const sqlRegex = /(?:db\.(?:get|query|run|all)\s*\(\s*['"`])(SELECT\s+.*?\s+FROM\s+\w+)/gi;
    let match: RegExpExecArray | null;

    while ((match = sqlRegex.exec(file.content)) !== null) {
      const sql = match[1].toLowerCase().replace(/\s+/g, " ");
      const lineIdx = file.content.slice(0, match.index).split("\n").length;
      const existing = sqlPatterns.find((p) => p.sql === sql);
      if (existing) {
        if (!existing.files.includes(file.path)) {
          existing.files.push(file.path);
          existing.lines.push(lineIdx);
        }
      } else {
        sqlPatterns.push({ sql, files: [file.path], lines: [lineIdx] });
      }
    }
  }

  for (const pattern of sqlPatterns) {
    if (pattern.files.length > 2) {
      issues.push({
        id: generateId(),
        severity: "warning",
        category: "架构级冗余",
        title: `重复 SQL 查询 (${pattern.files.length}处)`,
        location: pattern.files.join("、"),
        description: `相同的 SQL 查询 "${pattern.sql.slice(0, 80)}..." 在 ${pattern.files.length} 个文件中重复出现，建议提取为共享的数据库访问方法。`,
        impact: "提取为公共函数后不影响功能。建议统一到 model 层维护。",
        action: "提取为共享的 Model 方法，各 service 统一调用",
        codeSnippet: `// 在 ${pattern.files.length} 个文件中发现相同查询：\n${pattern.sql.slice(0, 150)}`,
        checked: false,
        effortHours: 1.5,
      });
    }
  }

  return issues;
}

// Main scan function
export async function scanProject(files: FileList): Promise<ScannedProject> {
  const scannedFiles: ScannedFile[] = [];
  let totalLines = 0;
  let jsFiles = 0;
  let jsonFiles = 0;
  let sqlFiles = 0;
  let envFiles = 0;
  let otherFiles = 0;
  let totalCyclomatic = 0;
  let filesAnalyzed = 0;
  let totalCommentRatio = 0;

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

      let complexity: FileComplexity | undefined;
      if (type === "js" || type === "ts") {
        complexity = calculateComplexity(content, filePath);
        totalCyclomatic += complexity.cyclomaticComplexity;
        filesAnalyzed++;
        totalCommentRatio += complexity.commentRatio;
      }

      scannedFiles.push({
        name: file.name,
        path: filePath,
        content,
        type,
        size: file.size,
        complexity,
      });
    } catch {
      // Skip unreadable
    }
  }

  const allIssues: AuditItem[] = [];

  for (const file of scannedFiles) {
    allIssues.push(...scanUnusedImports(file));
    allIssues.push(...scanCommentedCode(file));
    allIssues.push(...scanDeadFunctions(file));
    allIssues.push(...scanMagicNumbers(file));
    allIssues.push(...scanLowCommentCoverage(file));
    allIssues.push(...scanHighComplexity(file));
  }

  allIssues.push(...scanUnusedDependencies(scannedFiles));
  allIssues.push(...scanEnvFiles(scannedFiles));
  allIssues.push(...scanDuplicateLogic(scannedFiles));

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
      totalCyclomatic,
      avgPerFile: filesAnalyzed > 0 ? Math.round((totalCyclomatic / filesAnalyzed) * 10) / 10 : 0,
      filesAnalyzed,
      commentCoverage: filesAnalyzed > 0 ? Math.round((totalCommentRatio / filesAnalyzed) * 1000) / 10 : 0,
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

export const SCAN_STEPS = [
  { name: "读取文件列表", duration: 500 },
  { name: "解析 JS/TS 源码", duration: 800 },
  { name: "计算圈复杂度", duration: 400 },
  { name: "检测未使用导入", duration: 600 },
  { name: "扫描死函数", duration: 700 },
  { name: "查找注释代码块", duration: 500 },
  { name: "检测幻数常量", duration: 400 },
  { name: "分析注释覆盖率", duration: 400 },
  { name: "分析 package.json 依赖", duration: 600 },
  { name: "检查环境变量使用", duration: 500 },
  { name: "检测重复 SQL 查询", duration: 600 },
  { name: "去重与结果汇总", duration: 400 },
];
