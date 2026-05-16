export type Severity = "critical" | "warning" | "info" | "notice";

export interface AuditItem {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  location: string;
  description: string;
  impact: string;
  action: string;
  codeSnippet: string;
  checked: boolean;
  assignee?: string;        // Git blame 归属者
  complexity?: number;       // 圈复杂度或影响评分 1-10
  effortHours?: number;      // 预估修复工时
}

export interface CategoryGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: AuditItem[];
}

export interface ScanResult {
  fileName: string;
  filePath: string;
  content: string;
  issues: AuditItem[];
}

export interface FileComplexity {
  path: string;
  cyclomaticComplexity: number;  // 圈复杂度
  functionCount: number;
  avgFunctionComplexity: number;
  lines: number;
  commentRatio: number;        // 注释覆盖率 0-1
}

export interface ScannedProject {
  projectName: string;
  files: ScannedFile[];
  totalFiles: number;
  issues: AuditItem[];
  complexity: {
    totalCyclomatic: number;
    avgPerFile: number;
    filesAnalyzed: number;
    commentCoverage: number;   // 项目级注释覆盖率
  };
  stats: {
    totalLines: number;
    jsFiles: number;
    jsonFiles: number;
    sqlFiles: number;
    envFiles: number;
    otherFiles: number;
  };
}

export interface ScannedFile {
  name: string;
  path: string;
  content: string;
  type: "js" | "ts" | "json" | "sql" | "env" | "other";
  size: number;
  complexity?: FileComplexity;
}
