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
  AlertTriangle,
  Info,
  Code2,
  Database,
  FileCode,
  Settings,
  Trash2,
  GitMerge,
  Route,
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
  FileCheck,
  Search,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import type { AuditItem } from "@/types/audit";
import type { ScannedProject } from "@/lib/scanner";
import { scanProject, SCAN_STEPS } from "@/lib/scanner";
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

export default function HomePage() {
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

    // Simulate step-by-step progress
    let progress = 0;
    for (const step of SCAN_STEPS) {
      setCurrentStep(step.name);
      await new Promise((r) => setTimeout(r, step.duration));
      progress += 100 / SCAN_STEPS.length;
      setScanProgress(Math.min(progress, 100));
    }

    setCurrentStep("扫描完成");
    setScanProgress(100);

    // Run actual scan
    const project = await scanProject(files);
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

  // Group items by category
  const grouped = filteredItems.reduce<Record<string, AuditItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Upload Section - Only show when idle */}
      {phase === "idle" && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="text-center space-y-4 py-12">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10">
              <ScanLine className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Node.js 项目代码审计
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              上传你的项目文件夹，自动检测冗余代码、未使用依赖、死函数、
              注释代码块和历史功能残留。
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
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              // @ts-expect-error webkitdirectory is non-standard but supported
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                dragOver ? "bg-primary/20" : "bg-muted"
              }`}
            >
              {dragOver ? (
                <FolderOpen className="w-10 h-10 text-primary" />
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
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <EyeOff className="w-5 h-5" />,
                title: "未使用导入检测",
                desc: "扫描 require/import 语句中未被引用的模块和变量",
              },
              {
                icon: <Trash2 className="w-5 h-5" />,
                title: "死函数识别",
                desc: "发现定义但未被调用的函数和方法",
              },
              {
                icon: <FileCode className="w-5 h-5" />,
                title: "注释代码块",
                desc: "检测被注释掉的代码段和废弃逻辑",
              },
              {
                icon: <PackageOpen className="w-5 h-5" />,
                title: "依赖分析",
                desc: "对比 package.json 与实际代码中的依赖使用情况",
              },
              {
                icon: <Settings className="w-5 h-5" />,
                title: "环境变量审计",
                desc: "检查 .env 中定义但未使用的配置项",
              },
              {
                icon: <GitMerge className="w-5 h-5" />,
                title: "重复逻辑检测",
                desc: "发现多处出现的相似 SQL 查询和代码模式",
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "圈复杂度分析",
                desc: "计算文件和函数的圈复杂度，识别高复杂度模块",
              },
              {
                icon: <MessageSquare className="w-5 h-5" />,
                title: "幻数检测",
                desc: "发现未命名的字面量数值，建议提取为具名常量",
              },
              {
                icon: <MessageSquare className="w-5 h-5" />,
                title: "注释覆盖率审计",
                desc: "评估文件注释覆盖率，识别低注释模块",
              },
            ].map((cap, idx) => (
              <Card
                key={idx}
                className="audit-card hover:border-primary/30"
              >
                <CardContent className="p-0 space-y-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
                    {cap.icon}
                  </div>
                  <h3 className="font-semibold">{cap.title}</h3>
                  <p className="text-sm text-muted-foreground">{cap.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Example Link */}
          <div className="text-center pt-4">
            <button
              onClick={() => navigate("/examples")}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              查看示例审计报告，了解输出格式
            </button>
          </div>
        </div>
      )}

      {/* Scanning Progress */}
      {phase === "scanning" && (
        <div className="max-w-xl mx-auto space-y-8 py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">正在扫描项目...</h2>
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
            {SCAN_STEPS.map((step, idx) => {
              const isDone =
                scanProgress >= ((idx + 1) / SCAN_STEPS.length) * 100;
              const isCurrent =
                !isDone &&
                scanProgress >= (idx / SCAN_STEPS.length) * 100;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    isDone
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : isCurrent
                      ? "bg-primary/5 text-primary"
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
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <FileCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {result.projectName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  扫描完成 · {result.totalFiles} 个文件 · {result.stats.totalLines.toLocaleString()} 行代码
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPhase("idle");
                setResult(null);
                setItems([]);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" />
              扫描新项目
            </button>
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
              title="严重"
              value={criticalCount}
              icon={<AlertTriangle className="w-5 h-5" />}
              subtitle="需立即处理"
            />
            <StatCard
              title="建议"
              value={warningCount}
              icon={<AlertCircle className="w-5 h-5" />}
              subtitle="建议优化"
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
              subtitle="已完成清理"
            />
            <StatCard
              title="完成率"
              value={progressPercent}
              icon={<Zap className="w-5 h-5" />}
              subtitle="清理进度 %"
            />
          </div>

          {/* Complexity Stats */}
          {result && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                title="总圈复杂度"
                value={result.complexity.totalCyclomatic}
                icon={<BarChart3 className="w-5 h-5" />}
                subtitle="Cyclomatic"
              />
              <StatCard
                title="平均/文件"
                value={result.complexity.avgPerFile}
                icon={<BarChart3 className="w-5 h-5" />}
                subtitle="复杂度均值"
              />
              <StatCard
                title="注释覆盖率"
                value={`${result.complexity.commentCoverage}%`}
                icon={<MessageSquare className="w-5 h-5" />}
                subtitle="项目级"
              />
              <StatCard
                title="信息级"
                value={noticeCount}
                icon={<MessageSquare className="w-5 h-5" />}
                subtitle="参考信息"
              />
            </div>
          )}

          {/* File Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                {[
                  { label: "JS/TS 文件", value: result.stats.jsFiles, color: "text-blue-600 dark:text-blue-400" },
                  { label: "JSON 文件", value: result.stats.jsonFiles, color: "text-green-600 dark:text-green-400" },
                  { label: "SQL 文件", value: result.stats.sqlFiles, color: "text-purple-600 dark:text-purple-400" },
                  { label: "Env 文件", value: result.stats.envFiles, color: "text-amber-600 dark:text-amber-400" },
                  { label: "其他", value: result.stats.otherFiles, color: "text-gray-600 dark:text-gray-400" },
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
              <span className="text-muted-foreground">整体清理进度</span>
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
                    严重 ({criticalCount})
                  </TabsTrigger>
                  <TabsTrigger value="warning" className="text-xs">
                    建议 ({warningCount})
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
                    已完成 ({doneCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6 space-y-6">
                  {Object.entries(grouped).map(([category, catItems]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                      <h3 className="text-lg font-semibold">全部完成</h3>
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
                      <FileCode className="w-5 h-5 text-primary" />
                      审计方法论 &amp; 确认废弃的判定标准
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-blue-500" />
                            静态分析工具
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• depcheck — 检测未使用的 npm 依赖</li>
                            <li>• eslint (no-unused-vars) — 未使用变量</li>
                            <li>• VS Code "Find All References" — 函数引用追踪</li>
                            <li>• grep / ripgrep — 全局文本搜索</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Database className="w-4 h-4 text-green-500" />
                            数据库验证
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• sqlite3 直接查询表最后写入时间</li>
                            <li>• 对比 schema.sql 与代码中的查询语句</li>
                            <li>• 检查外键依赖和索引使用情况</li>
                            <li>• 查看 ORM 模型定义与实际表结构</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Route className="w-4 h-4 text-amber-500" />
                            路由验证
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Nginx access.log 分析端点请求频率</li>
                            <li>• 前端代码搜索 API 端点调用</li>
                            <li>• 对比路由注册与控制器实现</li>
                            <li>• 检查测试用例中的路由覆盖</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <GitMerge className="w-4 h-4 text-purple-500" />
                            Git 历史验证
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• git log --follow 查看文件修改历史</li>
                            <li>• git blame 定位代码最后修改时间</li>
                            <li>• 查看注释中的废弃标记日期</li>
                            <li>• 对比 tag 版本间的变更</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        删除前的安全检查清单
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {[
                          "确认代码中无引用（至少 2 种工具交叉验证）",
                          "确认无运行时动态调用（字符串拼接 require/eval）",
                          "确认无测试用例依赖",
                          "确认数据库无外部工具直接读写",
                          "已在独立分支操作，可随时回滚",
                          "删除后在 staging 环境完整回归测试",
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
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">未发现冗余代码</h3>
              <p className="text-sm text-muted-foreground mt-1">
                扫描完成，你的项目代码结构良好，未发现明显问题
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
