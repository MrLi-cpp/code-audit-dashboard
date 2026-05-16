import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Layers,
  Route,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSearch,
  Zap,
  Archive,
  HardDrive,
  PackageOpen,
  EyeOff,
  Hammer,
  BookOpen,
} from "lucide-react";
import type { AuditItem } from "@/types/audit";
import { exampleAuditData } from "@/data/exampleData";
import { AuditItemCard } from "@/components/AuditItemCard";

function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: number;
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

export default function ExamplesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState<AuditItem[]>(
    exampleAuditData.flatMap((g) => g.items)
  );

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => {
          if (activeTab === "critical") return item.severity === "critical";
          if (activeTab === "warning") return item.severity === "warning";
          if (activeTab === "info") return item.severity === "info";
          if (activeTab === "done") return item.checked;
          if (activeTab === "pending") return !item.checked;
          return true;
        });

  const totalItems = items.length;
  const criticalCount = items.filter((i) => i.severity === "critical").length;
  const warningCount = items.filter((i) => i.severity === "warning").length;
  const infoCount = items.filter((i) => i.severity === "info").length;
  const doneCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((doneCount / totalItems) * 100);

  const checklistItems = [
    { icon: <EyeOff className="w-4 h-4" />, label: "未使用变量/常量" },
    { icon: <Trash2 className="w-4 h-4" />, label: "死函数/方法" },
    { icon: <GitMerge className="w-4 h-4" />, label: "重复逻辑块" },
    { icon: <Hammer className="w-4 h-4" />, label: "过度工程化" },
    { icon: <FileCode className="w-4 h-4" />, label: "注释掉的代码块" },
    { icon: <Route className="w-4 h-4" />, label: "废弃路由" },
    { icon: <Layers className="w-4 h-4" />, label: "僵尸中间件" },
    { icon: <Database className="w-4 h-4" />, label: "废弃数据库表/字段" },
    { icon: <Settings className="w-4 h-4" />, label: "遗留配置文件" },
    { icon: <PackageOpen className="w-4 h-4" />, label: "未使用的依赖包" },
    { icon: <HardDrive className="w-4 h-4" />, label: "残留静态资源" },
    { icon: <Archive className="w-4 h-4" />, label: "过期迁移脚本" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">示例审计报告</h2>
          <p className="text-sm text-muted-foreground">
            基于模拟的 Node.js + Express + SQLite 项目，展示审计输出格式和检查维度
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>2026-05-16</span>
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

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">整体清理进度</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2.5" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Checklist */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                检查维度清单
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="checklist-item text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                严重级别说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center gap-3">
                <span className="severity-badge-critical">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  严重
                </span>
                <span className="text-xs text-muted-foreground">
                  技术债务高，优先清理
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="severity-badge-warning">
                  <AlertCircle className="w-3.5 h-3.5" />
                  建议
                </span>
                <span className="text-xs text-muted-foreground">
                  影响可维护性，建议优化
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="severity-badge-info">
                  <Info className="w-3.5 h-3.5" />
                  提示
                </span>
                <span className="text-xs text-muted-foreground">
                  参考信息，按需处理
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                操作建议类型
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {[
                {
                  action: "直接删除",
                  count: 12,
                  color:
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                },
                {
                  action: "提取复用",
                  count: 3,
                  color:
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                },
                {
                  action: "人工确认",
                  count: 2,
                  color:
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                >
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.color}`}
                  >
                    {item.action}
                  </span>
                  <span className="text-sm font-semibold">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Audit Items */}
        <div className="lg:col-span-9 space-y-6">
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
              <TabsTrigger value="pending" className="text-xs">
                待处理 ({totalItems - doneCount})
              </TabsTrigger>
              <TabsTrigger value="done" className="text-xs">
                已完成 ({doneCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-6">
              {exampleAuditData.map((group) => {
                const groupItems = filteredItems.filter((item) =>
                  group.items.some((gi) => gi.id === item.id)
                );
                if (groupItems.length === 0) return null;

                return (
                  <div key={group.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {group.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto shrink-0">
                        {groupItems.length} 项
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {groupItems.map((item) => (
                        <AuditItemCard
                          key={item.id}
                          item={item}
                          onToggle={() => toggleItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

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

          {/* Guidelines Section */}
          <Accordion type="single" collapsible className="mt-8">
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
                        <li>
                          • VS Code &quot;Find All References&quot; — 函数引用追踪
                        </li>
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
      </div>

      {/* Footer */}
      <footer className="border-t pt-6 pb-8 text-center text-sm text-muted-foreground">
        <p>
          Node.js 代码审计报告 — 示例项目 | 技术栈：Express + SQLite
        </p>
        <p className="mt-1">
          审计维度：冗余代码检测 / 历史功能残留排查 / 架构级冗余 | 共{" "}
          {totalItems} 项发现问题
        </p>
      </footer>
    </main>
  );
}
