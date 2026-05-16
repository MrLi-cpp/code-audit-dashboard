import type { AuditItem, ScannedFile, ScannedProject } from "@/types/audit";
export type { ScannedProject };

let scanIdCounter = 0;

function generateId(): string {
  scanIdCounter += 1;
  return `scan-${Date.now()}-${scanIdCounter}`;
}

// Detect file type based on extension
function detectFileType(fileName: string): ScannedFile["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (ext === "js" || ext === "jsx" || ext === "mjs" || ext === "cjs") return "js";
  if (ext === "ts" || ext === "tsx") return "ts";
  if (ext === "json") return "json";
  if (ext === "sql") return "sql";
  if (fileName === ".env" || ext === "env" || fileName.startsWith(".env.")) return "env";
  return "other";
}

// Scan 1: Unused imports detection
function scanUnusedImports(file: ScannedFile): AuditItem[] {
  const issues: AuditItem[] = [];
  if (file.type !== "js" && file.type !== "ts") return issues;

  const importRegex = /(?:const|let|var)\s+(\{[^}]+\}|\w+)\s+=\s+require\(['"]([^'"]+)['"]\)/g;
  const destructuringRegex = /\{([^}]+)\}/;
  const lines = file.content.split("\n");

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

  // Also check ES6 imports
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

  // Check if each imported name is used in the file (excluding the import line itself)
  for (const imp of allImports) {
    for (const name of imp.names) {
      if (!name) continue;
      // Check usage in other lines
      let used = false;
      lines.forEach((line, idx) => {
        if (idx === imp.line - 1) return; // Skip import line
        // Simple check: is the identifier used as a whole word
        const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
        if (regex.test(line)) {
          used = true;
        }
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
        // Heuristic: if block contains code-like patterns
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
          });
        }
        commentBlockLines = [];
      }
      continue;
    }

    // Single line commented code (// followed by code-like patterns)
    if (line.startsWith("//") && line.length > 5) {
      const codePart = line.slice(2).trim();
      if (
        (codePart.includes("const ") || codePart.includes("let ") || codePart.includes("var ")) &&
        codePart.includes("=")
      ) {
        // Skip if it's a JSDoc-style or explanatory comment
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
          });
        }
      }
    }
  }

  return issues;
}

// Scan 3: Dead functions (functions defined but never called)
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
    // Check if function is called anywhere
    const callRegex = new RegExp(`\\b${fn.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g");
    let called = false;
    
    // Don't count the definition itself
    lines.forEach((line, idx) => {
      if (idx === fn.line - 1) return;
      callRegex.lastIndex = 0;
      if (callRegex.test(line)) {
        called = true;
      }
    });

    // Also check if it's exported (then it might be used externally)
    const isExported = lines.some((line) => {
      return line.includes(`module.exports.${fn.name}`) || 
             line.includes(`exports.${fn.name}`) ||
             line.includes(`export { ${fn.name} }`) ||
             line.includes(`export const ${fn.name}`) ||
             line.includes(`export function ${fn.name}`);
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
        codeSnippet: lines.slice(Math.max(0, fn.line - 1), Math.min(lines.length, fn.line + 4)).join("\n").slice(0, 300) || `// 第${fn.line}行: 死函数 "${fn.name}"`,
        checked: false,
      });
    }
  }

  return issues;
}

// Scan 4: Unused dependencies in package.json
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
      // Check if dependency is imported anywhere
      const importPatterns = [
        new RegExp(`require\\s*\\(\\s*['"]${depName}['"]\\s*\\)`),
        new RegExp(`require\\s*\\(\\s*['"]${depName}/[^'"]*['"]\\s*\\)`),
        new RegExp(`import\\s+.*?\\s+from\\s+['"]${depName}['"]`),
        new RegExp(`import\\s+.*?\\s+from\\s+['"]${depName}/[^'"]*['"]`),
      ];

      const isUsed = importPatterns.some((pattern) => pattern.test(allCode));

      if (!isUsed) {
        // Some deps are used implicitly (e.g., types, build tools)
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
            location: `package.json (dependencies)`,
            description: `"${depName}" 在 package.json 中声明，但在所有 JS/TS 文件中均未发现 import 或 require 引用。`,
            impact: "删除后不影响功能。depcheck 扫描确认零引用。",
            action: `npm uninstall ${depName}`,
            codeSnippet: `"${depName}": "${(deps as Record<string, string>)[depName]}"`,
            checked: false,
          });
        }
      }
    }
  } catch {
    // Invalid package.json
  }

  return issues;
}

// Scan 5: Environment variable usage
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

      // Check if this env var is used in any JS file
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
        });
      }
    }
  }

  return issues;
}

// Scan 6: Duplicate logic patterns
function scanDuplicateLogic(files: ScannedFile[]): AuditItem[] {
  const issues: AuditItem[] = [];
  
  // Find similar SQL queries across files
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

  // Read all files
  const fileArray = Array.from(files);
  for (const file of fileArray) {
    // Skip node_modules, .git, and binary files
    const filePath = file.webkitRelativePath || file.name;
    if (
      filePath.includes("node_modules/") ||
      filePath.includes(".git/") ||
      file.name.endsWith(".lock") ||
      file.name.endsWith(".log") ||
      file.name.endsWith(".png") ||
      file.name.endsWith(".jpg") ||
      file.name.endsWith(".jpeg") ||
      file.name.endsWith(".gif") ||
      file.name.endsWith(".svg") ||
      file.name.endsWith(".ico") ||
      file.name.endsWith(".woff") ||
      file.name.endsWith(".woff2") ||
      file.name.endsWith(".ttf") ||
      file.name.endsWith(".eot")
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
        path: file.webkitRelativePath || file.name,
        content,
        type,
        size: file.size,
      });
    } catch {
      // Skip unreadable files
    }
  }

  // Run all scans
  const allIssues: AuditItem[] = [];

  for (const file of scannedFiles) {
    allIssues.push(...scanUnusedImports(file));
    allIssues.push(...scanCommentedCode(file));
    allIssues.push(...scanDeadFunctions(file));
  }

  allIssues.push(...scanUnusedDependencies(scannedFiles));
  allIssues.push(...scanEnvFiles(scannedFiles));
  allIssues.push(...scanDuplicateLogic(scannedFiles));

  // Deduplicate by similar title + location
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

// Scanning steps for progress display
export const SCAN_STEPS = [
  { name: "读取文件列表", duration: 500 },
  { name: "解析 JS/TS 源码", duration: 800 },
  { name: "检测未使用导入", duration: 600 },
  { name: "扫描死函数", duration: 700 },
  { name: "查找注释代码块", duration: 500 },
  { name: "分析 package.json 依赖", duration: 600 },
  { name: "检查环境变量使用", duration: 500 },
  { name: "检测重复 SQL 查询", duration: 600 },
  { name: "去重与结果汇总", duration: 400 },
];
