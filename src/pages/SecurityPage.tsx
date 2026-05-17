import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Database,
  FileCode,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Zap,
  PackageOpen,
  EyeOff,
  Upload,
  FolderOpen,
  Loader2,
  ScanLine,
  Lock,
  Bug,
  KeyRound,
  Globe,
  Fingerprint,
  FileUp,
  Server,
  Siren,
  Download,
  Folder,
} from "lucide-react";
import type { AuditItem, ScannedProject } from "@/types/audit";
import { scanSecurity, SECURITY_SCAN_STEPS } from "@/lib/securityScanner";
import { AuditItemCard } from "@/components/AuditItemCard";

type ScanPhase = "idle" | "scanning" | "done";

interface BatchResult {
  id: string;
  projectName: string;
  displayName: string;
  result: ScannedProject;
  items: AuditItem[];
  activeTab: string;
}

/* ───────── helpers ───────── */

function groupFilesByFolder(files: FileList): Map<string, File[]> {
  const groups = new Map<string, File[]>();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = file.webkitRelativePath || file.name;
    const folderName = path.split("/")[0] || "未命名项目";
    if (!groups.has(folderName)) groups.set(folderName, []);
    groups.get(folderName)!.push(file);
  }
  return groups;
}

function createFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  return dt.files;
}

function generateSecurityReport(
  displayName: string,
  project: ScannedProject,
  issues: AuditItem[]
): string {
  const now = new Date().toLocaleString("zh-CN");
  const total = issues.length;
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warning = issues.filter((i) => i.severity === "warning").length;
  const info = issues.filter((i) => i.severity === "info").length;
  const notice = issues.filter((i) => i.severity === "notice").length;
  const done = issues.filter((i) => i.checked).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  let md = `# 代码安全性审查报告 — ${displayName}\n\n`;
  md += `> 生成时间：${now}\n\n`;
  md += `---\n\n`;

  md += `## 项目概览\n\n`;
  md += `- **扫描文件数**：${project.totalFiles} 个\n`;
  md += `- **代码总行数**：${project.stats.totalLines.toLocaleString()} 行\n`;
  md += `- **发现漏洞总数**：${total} 个\n`;
  md += `- **高危**：${critical} | **警告**：${warning} | **提示**：${info} | **信息**：${notice}\n`;
  md += `- **已修复**：${done} / ${total}（修复率 ${progress}%）\n\n`;

  md += `## 文件统计\n\n`;
  md += `| 类型 | 数量 |\n`;
  md += `|------|------|\n`;
  md += `| JS/TS 文件 | ${project.stats.jsFiles} |\n`;
  md += `| JSON 文件 | ${project.stats.jsonFiles} |\n`;
  md += `| SQL 文件 | ${project.stats.sqlFiles} |\n`;
  md += `| Env 文件 | ${project.stats.envFiles} |\n`;
  md += `| 其他 | ${project.stats.otherFiles} |\n\n`;

  if (total > 0) {
    md += `## 漏洞详情\n\n`;
    const grouped = issues.reduce<Record<string, AuditItem[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([category, catItems]) => {
      md += `### ${category}（${catItems.length} 项）\n\n`;
      catItems.forEach((item) => {
        const sevMap: Record<string, string> = {
          critical: "高危",
          warning: "警告",
          info: "提示",
          notice: "信息",
        };
        md += `#### [${sevMap[item.severity]}] ${item.title}\n\n`;
        md += `- **位置**：\`${item.location}\`\n`;
        md += `- **描述**：${item.description}\n`;
        md += `- **影响**：${item.impact}\n`;
        md += `- **修复建议**：${item.action}\n`;
        md += `- **状态**：${item.checked ? "已修复 ✅" : "待修复 ⏳"}\n`;
        if (item.assignee) md += `- **责任人**：${item.assignee}\n`;
        if (item.effortHours) md += `- **预估工时**：${item.effortHours}h\n`;
        md += `- **代码片段**：\n\n`;
        md += `\`\`\`js\n${item.codeSnippet}\n\`\`\`\n\n`;
      });
    });
  } else {
    md += `## 漏洞详情\n\n未发现安全漏洞，项目通过基础安全检测。\n\n`;
  }

  md += `---\n\n`;
  md += `## 安全审计方法论摘要\n\n`;
  md += `本次审查基于 OWASP Top 10 和业界最佳实践，涵盖以下维度：\n\n`;
  md += `1. **注入漏洞检测** — SQL 注入、命令注入、eval / new Function 等代码注入\n`;
  md += `2. **硬编码密钥扫描** — API Key、密码、Token、AWS/GH 凭证等敏感信息\n`;
  md += `3. **XSS / DOM 漏洞** — innerHTML、dangerouslySetInnerHTML 等未过滤输出\n`;
  md += `4. **CSRF 防护缺失** — POST/PUT/DELETE 路由 CSRF 保护检测\n`;
  md += `5. **CORS 配置审计** — origin: * + credentials: true 等危险配置\n`;
  md += `6. **文件上传安全** — 检测上传处理是否缺少 MIME / 扩展名 / 文件头校验\n`;
  md += `7. **路径遍历风险** — fs.readFile、res.sendFile 等使用用户输入拼接路径\n`;
  md += `8. **认证安全检测** — 密码哈希强度、JWT 过期时间、Session 安全\n`;
  md += `9. **依赖漏洞扫描** — 已知漏洞依赖（lodash、jquery、ejs 等 CVE）\n`;
  md += `10. **安全响应头缺失** — helmet、CSP、HSTS、X-Frame-Options 等 HTTP 头\n`;
  md += `11. **ReDoS 正则检测** — 嵌套量词正则导致的拒绝服务风险\n`;
  md += `12. **敏感数据日志** — console.log / logger 输出中是否包含密码、Token\n\n`;
  md += `> 本报告由 CodeAudit Dashboard 自动生成。\n`;

  return md;
}

async function downloadWithPicker(content: string, suggestedName: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const picker = (window as any).showSaveFilePicker;
    if (picker) {
      const handle = await picker({
        suggestedName,
        types: [
          {
            description: "Markdown 文件",
            accept: { "text/markdown": [".md"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    } else {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.warn("Download cancelled", err);
  }
}

/* ───────── StatCard ───────── */

function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle: string;
}) {
  return (
    <Card className="audit-card">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────── SubResultViewer ───────── */

function SubResultViewer({
  batch,
  onToggleItem,
  onChangeTab,
}: {
  batch: BatchResult;
  onToggleItem: (batchId: string, itemId: string) => void;
  onChangeTab: (batchId: string, tab: string) => void;
}) {
  const { result, items, activeTab, id, displayName } = batch;

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => {
          if (activeTab === "critical") return item.severity === "critical";
          if (activeTab === "warning") return item.severity === "warning";
          if (activeTab === "info") return item.severity === "info";
          if (activeTab === "notice") return item.severity === "notice";
          if (activeTab === "done") return item.checked;
          if (activeTab === "pending") return !item.checked;
          return true;
        });

  const totalItems = items.length;
  const criticalCount = items.filter((i) => i.severity === "critical").length;
  const warningCount = items.filter((i) => i.severity === "warning").length;
  const infoCount = items.filter((i) => i.severity === "info").length;
  const noticeCount = items.filter((i) => i.severity === "notice").length;
  const doneCount = items.filter((i) => i.checked).length;
  const progressPercent = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

  const grouped = filteredItems.reduce<Record<string, AuditItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
          <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">
            {result.totalFiles} 个文件 · {result.stats.totalLines.toLocaleString()} 行 · {totalItems} 个问题
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="总问题数" value={totalItems} icon={<FileSearch className="w-4 h-4" />} subtitle="全部" />
        <StatCard title="高危" value={criticalCount} icon={<AlertTriangle className="w-4 h-4" />} subtitle="需立即处理" />
        <StatCard title="警告" value={warningCount} icon={<AlertCircle className="w-4 h-4" />} subtitle="建议修复" />
        <StatCard title="提示" value={infoCount} icon={<Info className="w-4 h-4" />} subtitle="参考信息" />
        <StatCard title="已处理" value={doneCount} icon={<CheckCircle2 className="w-4 h-4" />} subtitle="已完成" />
        <StatCard title="完成率" value={progressPercent} icon={<Zap className="w-4 h-4" />} subtitle="%" />
      </div>

      {/* File types */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { label: "JS/TS", value: result.stats.jsFiles, color: "text-blue-600 dark:text-blue-400" },
              { label: "JSON", value: result.stats.jsonFiles, color: "text-green-600 dark:text-green-400" },
              { label: "SQL", value: result.stats.sqlFiles, color: "text-purple-600 dark:text-purple-400" },
              { label: "Env", value: result.stats.envFiles, color: "text-amber-600 dark:text-amber-400" },
              { label: "其他", value: result.stats.otherFiles, color: "text-gray-600 dark:text-gray-400" },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">整体修复进度</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Issues */}
      {totalItems > 0 ? (
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={(t) => onChangeTab(id, t)}>
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="text-xs">全部 ({totalItems})</TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">高危 ({criticalCount})</TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">警告 ({warningCount})</TabsTrigger>
              <TabsTrigger value="info" className="text-xs">提示 ({infoCount})</TabsTrigger>
              <TabsTrigger value="notice" className="text-xs">信息 ({noticeCount})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">待处理 ({totalItems - doneCount})</TabsTrigger>
              <TabsTrigger value="done" className="text-xs">已修复 ({doneCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 space-y-5">
              {Object.entries(grouped).map(([category, catItems]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold">{category}</h4>
                      <p className="text-xs text-muted-foreground">发现 {catItems.length} 个问题</p>
                    </div>
                    <Badge variant="outline" className="ml-auto shrink-0">{catItems.length} 项</Badge>
                  </div>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <AuditItemCard key={item.id} item={item} onToggle={() => onToggleItem(id, item.id)} />
                    ))}
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <h4 className="text-base font-semibold">全部修复</h4>
                  <p className="text-sm text-muted-foreground mt-1">当前筛选条件下没有待处理项</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShieldCheck className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold">未发现安全漏洞</h4>
          <p className="text-sm text-muted-foreground mt-1">该文件夹通过基础安全检测</p>
        </div>
      )}
    </div>
  );
}

/* ───────── SecurityPage ───────── */

export default function SecurityPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(new Set());

  /* 队列扫描 */
  const runScan = useCallback(async (files: FileList) => {
    const groups = groupFilesByFolder(files);
    const entries = Array.from(groups.entries());

    if (entries.length > 100) {
      alert(`最多支持 100 个文件夹，当前选择了 ${entries.length} 个。请减少后重试。`);
      return;
    }
    if (entries.length === 0) {
      alert("未检测到有效文件。");
      return;
    }

    setPhase("scanning");
    setScanProgress(0);
    setBatchResults([]);
    setCurrentIndex(0);
    setTotalCount(entries.length);
    setSelectedForDownload(new Set());

    const results: BatchResult[] = [];

    for (let i = 0; i < entries.length; i++) {
      const [folderName, folderFiles] = entries[i];
      setCurrentIndex(i + 1);

      let progress = 0;
      for (const step of SECURITY_SCAN_STEPS) {
        setCurrentStep(`${step.name} — ${folderName} (${i + 1}/${entries.length})`);
        await new Promise((r) => setTimeout(r, step.duration));
        progress += 100 / SECURITY_SCAN_STEPS.length;
        setScanProgress(Math.min(progress, 100));
      }

      const fileList = createFileList(folderFiles);
      const project = await scanSecurity(fileList);
      const batchItem: BatchResult = {
        id: `batch-${Date.now()}-${i}`,
        projectName: folderName,
        displayName: `第${i + 1}份文件`,
        result: project,
        items: project.issues,
        activeTab: "all",
      };
      results.push(batchItem);
      setBatchResults([...results]);
      setScanProgress(0);
    }

    setCurrentStep("扫描完成");
    setScanProgress(100);
    setCurrentIndex(entries.length);

    const allIds = results.map((r) => r.id);
    setSelectedForDownload(new Set(allIds));

    await new Promise((r) => setTimeout(r, 500));
    setPhase("done");
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      runScan(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      runScan(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const toggleItem = useCallback((batchId: string, itemId: string) => {
    setBatchResults((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? { ...b, items: b.items.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it)) }
          : b
      )
    );
  }, []);

  const changeTab = useCallback((batchId: string, tab: string) => {
    setBatchResults((prev) => prev.map((b) => (b.id === batchId ? { ...b, activeTab: tab } : b)));
  }, []);

  /* 下载 */
  const handleDownloadSelected = async () => {
    const toDownload = batchResults.filter((b) => selectedForDownload.has(b.id));
    for (const batch of toDownload) {
      const md = generateSecurityReport(batch.displayName, batch.result, batch.items);
      const filename = `security-report-${batch.displayName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-")}-${new Date().toISOString().slice(0, 10)}.md`;
      await downloadWithPicker(md, filename);
      await new Promise((r) => setTimeout(r, 300));
    }
    setDownloadDialogOpen(false);
  };

  /* 汇总统计 */
  const totalScannedFiles = batchResults.reduce((sum, b) => sum + b.result.totalFiles, 0);
  const totalIssues = batchResults.reduce((sum, b) => sum + b.items.length, 0);
  const totalCritical = batchResults.reduce((sum, b) => sum + b.items.filter((i) => i.severity === "critical").length, 0);
  const totalWarning = batchResults.reduce((sum, b) => sum + b.items.filter((i) => i.severity === "warning").length, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ═════ Idle ═════ */}
      {phase === "idle" && (
        <div className="space-y-6">
          <div className="text-center space-y-4 py-12">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10">
              <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">代码安全性审查</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              批量上传多个项目文件夹，自动检测 SQL 注入、XSS、硬编码密钥、CSRF、命令注入、文件上传漏洞等安全威胁。
              <span className="block text-sm mt-1 text-muted-foreground/70">每次最多支持 100 个文件夹，队列逐个扫描。</span>
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center space-y-4 ${
              dragOver
                ? "border-red-400 bg-red-50/50 dark:bg-red-900/10 scale-[1.01]"
                : "border-muted-foreground/25 hover:border-red-400/50 hover:bg-red-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              // @ts-expect-error webkitdirectory
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-colors ${dragOver ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"}`}>
              {dragOver ? <FolderOpen className="w-10 h-10 text-red-500" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">{dragOver ? "松开以上传文件夹" : "选择或拖拽项目文件夹"}</p>
              <p className="text-sm text-muted-foreground">支持同时选择多个文件夹，自动排除 node_modules 和 .git</p>
              <p className="text-xs text-muted-foreground/60">最多 100 个文件夹 · 队列逐个扫描</p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Badge variant="secondary">.js .ts</Badge>
              <Badge variant="secondary">.json</Badge>
              <Badge variant="secondary">.sql</Badge>
              <Badge variant="secondary">.env</Badge>
              <Badge variant="secondary">.html</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Database className="w-5 h-5" />, title: "注入漏洞检测", desc: "SQL 注入、命令注入、eval / new Function 等代码注入" },
              { icon: <KeyRound className="w-5 h-5" />, title: "硬编码密钥扫描", desc: "API Key、密码、Token、AWS/GH 凭证等敏感信息" },
              { icon: <Bug className="w-5 h-5" />, title: "XSS / DOM 漏洞", desc: "innerHTML、dangerouslySetInnerHTML 等未过滤输出" },
              { icon: <Lock className="w-5 h-5" />, title: "CSRF 防护缺失", desc: "检测 POST/PUT/DELETE 路由是否缺少 CSRF 保护" },
              { icon: <Globe className="w-5 h-5" />, title: "CORS 配置审计", desc: "origin: * + credentials: true 等危险配置" },
              { icon: <FileUp className="w-5 h-5" />, title: "文件上传安全", desc: "检测上传处理是否缺少 MIME / 扩展名 / 文件头校验" },
              { icon: <FileCode className="w-5 h-5" />, title: "路径遍历风险", desc: "fs.readFile、res.sendFile 等使用用户输入拼接路径" },
              { icon: <Fingerprint className="w-5 h-5" />, title: "认证安全检测", desc: "密码哈希强度、JWT 过期时间、Session 安全" },
              { icon: <PackageOpen className="w-5 h-5" />, title: "依赖漏洞扫描", desc: "已知漏洞依赖（lodash、jquery、ejs 等 CVE）" },
              { icon: <Siren className="w-5 h-5" />, title: "安全响应头缺失", desc: "helmet、CSP、HSTS、X-Frame-Options 等 HTTP 头" },
              { icon: <Server className="w-5 h-5" />, title: "ReDoS 正则检测", desc: "嵌套量词正则表达式导致的拒绝服务风险" },
              { icon: <EyeOff className="w-5 h-5" />, title: "敏感数据日志", desc: "console.log / logger 输出中是否包含密码、Token" },
            ].map((cap, idx) => (
              <Card key={idx} className="audit-card hover:border-red-400/30">
                <CardContent className="p-0 space-y-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 w-fit">{cap.icon}</div>
                  <h3 className="font-semibold">{cap.title}</h3>
                  <p className="text-sm text-muted-foreground">{cap.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4">
            <button onClick={() => navigate("/")} className="text-sm text-primary hover:underline inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              切换到代码质量审查
            </button>
          </div>
        </div>
      )}

      {/* ═════ Scanning ═════ */}
      {phase === "scanning" && (
        <div className="max-w-xl mx-auto space-y-8 py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10">
              <Loader2 className="w-12 h-12 text-red-600 dark:text-red-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">
              正在扫描安全漏洞… {currentIndex > 0 && `(${currentIndex}/${totalCount})`}
            </h2>
            <p className="text-muted-foreground">{currentStep}</p>
          </div>

          <div className="space-y-3">
            <Progress value={scanProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentIndex > 0 ? `第 ${currentIndex} / ${totalCount} 个文件夹` : "准备中"}</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
          </div>

          {batchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">已完成</p>
              {batchResults.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{b.projectName}</span>
                  <span className="ml-auto shrink-0 text-xs">{b.items.length} 个问题</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {SECURITY_SCAN_STEPS.map((step, idx) => {
              const isDone = scanProgress >= ((idx + 1) / SECURITY_SCAN_STEPS.length) * 100;
              const isCurrent = !isDone && scanProgress >= (idx / SECURITY_SCAN_STEPS.length) * 100;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    isDone
                      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : isCurrent
                      ? "bg-red-500/5 text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  )}
                  <span>{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════ Done ═════ */}
      {phase === "done" && batchResults.length > 0 && (
        <div className="space-y-6">
          {/* 下载横幅 */}
          <div className="rounded-2xl border-2 border-red-400/20 bg-gradient-to-r from-red-50/50 via-red-100/30 to-red-50/50 dark:from-red-900/10 dark:via-red-900/15 dark:to-red-900/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-red-600 shadow-lg shadow-red-600/20">
                  <Download className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">安全审查报告已生成</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    共扫描 {batchResults.length} 个文件夹 · {totalScannedFiles} 个文件 · {totalIssues} 个问题
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDownloadDialogOpen(true)}
                className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-red-600 text-white text-base font-bold shadow-lg shadow-red-600/25 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Download className="w-6 h-6" />
                下载报告
              </button>
            </div>
          </div>

          {/* 汇总卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="扫描文件夹" value={batchResults.length} icon={<Folder className="w-5 h-5" />} subtitle="总计" />
            <StatCard title="总漏洞数" value={totalIssues} icon={<FileSearch className="w-5 h-5" />} subtitle="全部检查项" />
            <StatCard title="高危" value={totalCritical} icon={<AlertTriangle className="w-5 h-5" />} subtitle="需立即处理" />
            <StatCard title="警告" value={totalWarning} icon={<AlertCircle className="w-5 h-5" />} subtitle="建议修复" />
          </div>

          {/* 折叠结果 */}
          <Accordion type="multiple" className="space-y-3">
            {batchResults.map((batch) => {
              const issueCount = batch.items.length;
              const critical = batch.items.filter((i) => i.severity === "critical").length;
              const warning = batch.items.filter((i) => i.severity === "warning").length;
              return (
                <AccordionItem
                  key={batch.id}
                  value={batch.id}
                  className="border rounded-xl px-4 data-[state=open]:bg-muted/20"
                >
                  <AccordionTrigger className="hover:no-underline py-4 text-left">
                    <div className="flex items-center gap-4 w-full pr-4">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-semibold truncate">{batch.displayName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {batch.result.totalFiles} 文件 · {batch.result.stats.totalLines.toLocaleString()} 行
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {critical > 0 && (
                          <Badge variant="destructive" className="text-xs">高危 {critical}</Badge>
                        )}
                        {warning > 0 && (
                          <Badge variant="secondary" className="text-xs text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20">
                            警告 {warning}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{issueCount} 项</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="pt-2 border-t">
                      <SubResultViewer batch={batch} onToggleItem={toggleItem} onChangeTab={changeTab} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* 方法论 */}
          <Accordion type="single" collapsible>
            <AccordionItem value="guidelines">
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  安全审计方法论 &amp; OWASP 参考
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Database className="w-4 h-4 text-red-500" />
                        注入漏洞（OWASP Top 10 #1）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• SQL 注入：使用参数化查询 / ORM</li>
                        <li>• 命令注入：使用 execFile 参数数组</li>
                        <li>• eval 注入：用 JSON.parse 替代</li>
                        <li>• LDAP / XPath 注入：白名单校验</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-500" />
                        认证与授权（OWASP Top 10 #7）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 密码：bcrypt / scrypt / argon2id</li>
                        <li>• JWT：设置 expiresIn + refresh token</li>
                        <li>• Session：HttpOnly + Secure + SameSite</li>
                        <li>• CSRF：Token 或 SameSite Cookie</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Bug className="w-4 h-4 text-blue-500" />
                        XSS 防护（OWASP Top 10 #3）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 输出编码：textContent 替代 innerHTML</li>
                        <li>• CSP：Content-Security-Policy 头</li>
                        <li>• 输入校验：白名单 + 类型校验</li>
                        <li>• DOMPurify：必须插入 HTML 时净化</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-500" />
                        依赖与供应链（OWASP Top 10 #6）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• npm audit：定期扫描 CVE</li>
                        <li>• Snyk / Dependabot：自动漏洞检测</li>
                        <li>• 版本锁定：package-lock.json</li>
                        <li>• 最小依赖：移除未使用的包</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    部署前安全检查清单
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {[
                      "SQL 注入零处：所有查询参数化",
                      "零处 eval / new Function / child_process.exec 拼接",
                      "无硬编码密钥（gitleaks / truffleHog 扫描通过）",
                      "CSP / X-Frame-Options / HSTS 响应头已配置",
                      "CSRF Token 覆盖所有状态变更路由",
                      "文件上传限制 MIME 白名单 + 文件头校验",
                      "密码使用 bcrypt cost ≥ 12 或 argon2id",
                      "JWT 设置 expiresIn ≤ 1h，refresh token ≤ 7d",
                      "npm audit 零高危漏洞，或已评估并修复",
                      "生产环境禁用 debug 模式，无 console.log 残留",
                    ].map((check, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* 底部操作 */}
          <div className="flex items-center justify-center pt-4 gap-3">
            <button
              onClick={() => {
                setPhase("idle");
                setBatchResults([]);
                setSelectedForDownload(new Set());
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" />
              扫描新项目
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              质量审查
            </button>
          </div>
        </div>
      )}

      {/* ═════ Download Dialog ═════ */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-red-600" />
              选择要下载的报告
            </DialogTitle>
            <DialogDescription>勾选需要下载的报告文件，将逐个保存为 Markdown 格式。</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Checkbox
                id="select-all-sec"
                checked={selectedForDownload.size === batchResults.length && batchResults.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedForDownload(new Set(batchResults.map((b) => b.id)));
                  } else {
                    setSelectedForDownload(new Set());
                  }
                }}
              />
              <label htmlFor="select-all-sec" className="text-sm font-medium cursor-pointer">
                全选 / 取消全选
              </label>
            </div>
            {batchResults.map((batch) => (
              <div key={batch.id} className="flex items-start gap-3 px-1">
                <Checkbox
                  id={`dl-sec-${batch.id}`}
                  checked={selectedForDownload.has(batch.id)}
                  onCheckedChange={(checked) => {
                    setSelectedForDownload((prev) => {
                      const next = new Set(prev);
                      if (checked) next.add(batch.id);
                      else next.delete(batch.id);
                      return next;
                    });
                  }}
                />
                <div className="min-w-0 flex-1">
                  <label htmlFor={`dl-sec-${batch.id}`} className="text-sm font-medium cursor-pointer block truncate">
                    {batch.displayName}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {batch.result.totalFiles} 文件 · {batch.items.length} 个问题
                  </p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <button
              onClick={() => setDownloadDialogOpen(false)}
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleDownloadSelected}
              disabled={selectedForDownload.size === 0}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载选中 ({selectedForDownload.size})
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
