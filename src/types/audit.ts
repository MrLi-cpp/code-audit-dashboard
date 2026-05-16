export type Severity = "critical" | "warning" | "info";

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

export interface ScannedProject {
  projectName: string;
  files: ScannedFile[];
  totalFiles: number;
  issues: AuditItem[];
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
}
