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
} from "lucide-react";
import type { AuditItem, ScannedProject } from "@/types/audit";
import { scanSecurity, SECURITY_SCAN_STEPS } from "@/lib/securityScanner";
import { AuditItemCard } from "@/components/AuditItemCard";

type ScanPhase = "idle" | "scanning" | "done";

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
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SecurityPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [result, setResult] = useState<ScannedProject | null>(null);
  const [items, setItems] = useState<AuditItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [dragOver, setDragOver] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const runScan = useCallback(async (files: FileList) => {
    setPhase("scanning");
    setScanProgress(0);
    setResult(null);
    setItems([]);

    let progress = 0;
    for (const step of SECURITY_SCAN_STEPS) {
      setCurrentStep(step.name);
      await new Promise((r) => setTimeout(r, step.duration));
      progress += 100 / SECURITY_SCAN_STEPS.length;
      setScanProgress(Math.min(progress, 100));
    }

    setCurrentStep("扫描完成");
    setScanProgress(100);

    const project = await scanSecurity(files);
    setResult(project);
    setItems(project.issues);

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

  const handleDragLeave = () => {
    setDragOver(false);
  };

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
  const progressPercent =
    totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

  const grouped = filteredItems.reduce<Record<string, AuditItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Idle: Upload */}
      {phase === "idle" && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="text-center space-y-4 py-12">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10">
              <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              代码安全性审查
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              上传你的项目文件夹，自动检测 SQL 注入、XSS、硬编码密钥、
              CSRF、命令注入、文件上传漏洞等安全威胁。
            </p>
          </div>

          {/* Upload Zone */}
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
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                dragOver ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"
              }`}
            >
              {dragOver ? (
                <FolderOpen className="w-10 h-10 text-red-500" />
              ) : (
                <Upload className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {dragOver ? "松开以上传文件夹" : "选择或拖拽项目文件夹"}
              </p>
              <p className="text-sm text-muted-foreground">
                支持整个项目目录上传，自动排除 node_modules 和 .git
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Badge variant="secondary">.js .ts</Badge>
              <Badge variant="secondary">.json</Badge>
              <Badge variant="secondary">.sql</Badge>
              <Badge variant="secondary">.env</Badge>
              <Badge variant="secondary">.html</Badge>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <Database className="w-5 h-5" />,
                title: "注入漏洞检测",
                desc: "SQL 注入、命令注入、eval / new Function 等代码注入",
              },
              {
                icon: <KeyRound className="w-5 h-5" />,
                title: "硬编码密钥扫描",
                desc: "API Key、密码、Token、AWS/GH 凭证等敏感信息",
              },
              {
                icon: <Bug className="w-5 h-5" />,
                title: "XSS / DOM 漏洞",
                desc: "innerHTML、dangerouslySetInnerHTML 等未过滤输出",
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: "CSRF 防护缺失",
                desc: "检测 POST/PUT/DELETE 路由是否缺少 CSRF 保护",
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "CORS 配置审计",
                desc: "origin: * + credentials: true 等危险配置",
              },
              {
                icon: <FileUp className="w-5 h-5" />,
                title: "文件上传安全",
                desc: "检测上传处理是否缺少 MIME / 扩展名 / 文件头校验",
              },
              {
                icon: <FileCode className="w-5 h-5" />,
                title: "路径遍历风险",
                desc: "fs.readFile、res.sendFile 等使用用户输入拼接路径",
              },
              {
                icon: <Fingerprint className="w-5 h-5" />,
                title: "认证安全检测",
                desc: "密码哈希强度、JWT 过期时间、Session 安全",
              },
              {
                icon: <PackageOpen className="w-5 h-5" />,
                title: "依赖漏洞扫描",
                desc: "已知漏洞依赖（lodash、jquery、ejs 等 CVE）",
              },
              {
                icon: <Siren className="w-5 h-5" />,
                title: "安全响应头缺失",
                desc: "helmet、CSP、HSTS、X-Frame-Options 等 HTTP 头",
              },
              {
                icon: <Server className="w-5 h-5" />,
                title: "ReDoS 正则检测",
                desc: "嵌套量词正则表达式导致的拒绝服务风险",
              },
              {
                icon: <EyeOff className="w-5 h-5" />,
                title: "敏感数据日志",
                desc: "console.log / logger 输出中是否包含密码、Token",
              },
            ].map((cap, idx) => (
              <Card key={idx} className="audit-card hover:border-red-400/30">
                <CardContent className="p-0 space-y-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 w-fit">
                    {cap.icon}
                  </div>
                  <h3 className="font-semibold">{cap.title}</h3>
                  <p className="text-sm text-muted-foreground">{cap.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Switch to Quality Audit */}
          <div className="text-center pt-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              切换到代码质量审查
            </button>
          </div>
        </div>
      )}

      {/* Scanning Progress */}
      {phase === "scanning" && (
        <div className="max-w-xl mx-auto space-y-8 py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10">
              <Loader2 className="w-12 h-12 text-red-600 dark:text-red-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">正在扫描安全漏洞...</h2>
            <p className="text-muted-foreground">{currentStep}</p>
          </div>
          <div className="space-y-3">
            <Progress value={scanProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>分析中</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            {SECURITY_SCAN_STEPS.map((step, idx) => {
              const isDone =
                scanProgress >= ((idx + 1) / SECURITY_SCAN_STEPS.length) * 100;
              const isCurrent =
                !isDone &&
                scanProgress >= (idx / SECURITY_SCAN_STEPS.length) * 100;
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

      {/* Scan Results */}
      {phase === "done" && result && (
        <div className="space-y-6">
          {/* Result Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{result.projectName}</h2>
                <p className="text-sm text-muted-foreground">
                  安全扫描完成 · {result.totalFiles} 个文件 ·{" "}
                  {result.stats.totalLines.toLocaleString()} 行代码
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPhase("idle");
                  setResult(null);
                  setItems([]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
              >
                <Upload className="w-4 h-4" />
                重新扫描
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

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              title="总问题数"
              value={totalItems}
              icon={<FileSearch className="w-5 h-5" />}
              subtitle="全部检查项"
            />
            <StatCard
              title="高危"
              value={criticalCount}
              icon={<AlertTriangle className="w-5 h-5" />}
              subtitle="需立即处理"
            />
            <StatCard
              title="警告"
              value={warningCount}
              icon={<AlertCircle className="w-5 h-5" />}
              subtitle="建议修复"
            />
            <StatCard
              title="提示"
              value={infoCount}
              icon={<Info className="w-5 h-5" />}
              subtitle="参考信息"
            />
            <StatCard
              title="已处理"
              value={doneCount}
              icon={<CheckCircle2 className="w-5 h-5" />}
              subtitle="已完成修复"
            />
            <StatCard
              title="修复率"
              value={progressPercent}
              icon={<Zap className="w-5 h-5" />}
              subtitle="修复进度 %"
            />
          </div>

          {/* File Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                {[
                  {
                    label: "JS/TS 文件",
                    value: result.stats.jsFiles,
                    color: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    label: "JSON 文件",
                    value: result.stats.jsonFiles,
                    color: "text-green-600 dark:text-green-400",
                  },
                  {
                    label: "SQL 文件",
                    value: result.stats.sqlFiles,
                    color: "text-purple-600 dark:text-purple-400",
                  },
                  {
                    label: "Env 文件",
                    value: result.stats.envFiles,
                    color: "text-amber-600 dark:text-amber-400",
                  },
                  {
                    label: "其他",
                    value: result.stats.otherFiles,
                    color: "text-gray-600 dark:text-gray-400",
                  },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">整体修复进度</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2.5" />
          </div>

          {/* Issues List */}
          {totalItems > 0 ? (
            <div className="space-y-6">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="flex flex-wrap h-auto gap-1">
                  <TabsTrigger value="all" className="text-xs">
                    全部 ({totalItems})
                  </TabsTrigger>
                  <TabsTrigger value="critical" className="text-xs">
                    高危 ({criticalCount})
                  </TabsTrigger>
                  <TabsTrigger value="warning" className="text-xs">
                    警告 ({warningCount})
                  </TabsTrigger>
                  <TabsTrigger value="info" className="text-xs">
                    提示 ({infoCount})
                  </TabsTrigger>
                  <TabsTrigger value="notice" className="text-xs">
                    信息 ({noticeCount})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">
                    待处理 ({totalItems - doneCount})
                  </TabsTrigger>
                  <TabsTrigger value="done" className="text-xs">
                    已修复 ({doneCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6 space-y-6">
                  {Object.entries(grouped).map(([category, catItems]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                          <ScanLine className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">{category}</h2>
                          <p className="text-sm text-muted-foreground">
                            发现 {catItems.length} 个问题
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-auto shrink-0">
                          {catItems.length} 项
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {catItems.map((item) => (
                          <AuditItemCard
                            key={item.id}
                            item={item}
                            onToggle={() => toggleItem(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">全部修复</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        当前筛选条件下没有待处理项
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Guidelines */}
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
            </div>
          ) : (
            <div className="text-center py-20">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">未发现安全漏洞</h3>
              <p className="text-sm text-muted-foreground mt-1">
                扫描完成，你的项目通过基础安全检测，继续保持！
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
