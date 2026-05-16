import { useState } from "react";
import { useNavigate } from "react-router";
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
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Database,
  Lock,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSearch,
  Zap,
  PackageOpen,
  Bug,
  KeyRound,
  Globe,
  Siren,
  MessageSquare,
  Fingerprint,
  FileUp,
  Server,
  EyeOff,
  FileCode,
} from "lucide-react";
import type { AuditItem } from "@/types/audit";
import { securityExampleData } from "@/data/securityExampleData";
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

export default function SecurityExamplesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState<AuditItem[]>(
    securityExampleData.flatMap((g) => g.items)
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
  const progressPercent = Math.round((doneCount / totalItems) * 100);

  const checklistItems = [
    { icon: <Database className="w-4 h-4" />, label: "SQL 注入风险" },
    { icon: <Siren className="w-4 h-4" />, label: "命令注入 / eval" },
    { icon: <KeyRound className="w-4 h-4" />, label: "硬编码密钥 / Token" },
    { icon: <Bug className="w-4 h-4" />, label: "XSS / innerHTML" },
    { icon: <Lock className="w-4 h-4" />, label: "CSRF 防护缺失" },
    { icon: <Globe className="w-4 h-4" />, label: "CORS 配置风险" },
    { icon: <FileUp className="w-4 h-4" />, label: "文件上传无校验" },
    { icon: <FileCode className="w-4 h-4" />, label: "路径遍历" },
    { icon: <Fingerprint className="w-4 h-4" />, label: "密码哈希强度" },
    { icon: <Server className="w-4 h-4" />, label: "JWT 过期缺失" },
    { icon: <PackageOpen className="w-4 h-4" />, label: "依赖漏洞（CVE）" },
    { icon: <Shield className="w-4 h-4" />, label: "安全响应头缺失" },
    { icon: <Zap className="w-4 h-4" />, label: "ReDoS 正则" },
    { icon: <EyeOff className="w-4 h-4" />, label: "敏感数据日志" },
    { icon: <AlertCircle className="w-4 h-4" />, label: "debugger 残留" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-red-500/10">
          <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            安全审计示例报告
          </h2>
          <p className="text-sm text-muted-foreground">
            基于模拟的 Node.js + Express + SQLite 项目，展示安全审计输出格式和检查维度
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate("/security")}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            开始安全审查
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>2026-05-17</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
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
          title="信息"
          value={noticeCount}
          icon={<MessageSquare className="w-5 h-5" />}
          subtitle="低优先级"
        />
        <StatCard
          title="已修复"
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

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">整体修复进度</span>
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
                  高危
                </span>
                <span className="text-xs text-muted-foreground">
                  攻击者可利用，立即修复
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="severity-badge-warning">
                  <AlertCircle className="w-3.5 h-3.5" />
                  警告
                </span>
                <span className="text-xs text-muted-foreground">
                  安全风险较高，建议修复
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
              <div className="flex items-center gap-3">
                <span className="severity-badge-notice">
                  <MessageSquare className="w-3.5 h-3.5" />
                  信息
                </span>
                <span className="text-xs text-muted-foreground">
                  低优先级参考
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                修复建议类型
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {[
                {
                  action: "立即修复",
                  count: 4,
                  color:
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                },
                {
                  action: "重构代码",
                  count: 3,
                  color:
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                },
                {
                  action: "配置加固",
                  count: 2,
                  color:
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                },
                {
                  action: "依赖升级",
                  count: 1,
                  color:
                    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
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
              {securityExampleData.map((group) => {
                const groupItems = filteredItems.filter((item) =>
                  group.items.some((gi) => gi.id === item.id)
                );
                if (groupItems.length === 0) return null;

                return (
                  <div key={group.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                        <ShieldAlert className="w-5 h-5" />
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
                  <h3 className="text-lg font-semibold">全部修复</h3>
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
                  <Shield className="w-5 h-5 text-primary" />
                  安全审计方法论 &amp; OWASP Top 10 参考
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Database className="w-4 h-4 text-red-500" />
                        注入漏洞（OWASP #1）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• SQL 注入：参数化查询 / ORM</li>
                        <li>• 命令注入：execFile 参数数组</li>
                        <li>• eval 注入：JSON.parse 替代</li>
                        <li>• 正则 ReDoS：避免嵌套量词</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-500" />
                        认证与授权（OWASP #7）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 密码：bcrypt cost ≥ 12</li>
                        <li>• JWT：expiresIn + refresh</li>
                        <li>• Session：HttpOnly Secure</li>
                        <li>• CSRF：Token / SameSite</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Bug className="w-4 h-4 text-blue-500" />
                        XSS 防护（OWASP #3）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• textContent 替代 innerHTML</li>
                        <li>• CSP 响应头配置</li>
                        <li>• 输入白名单校验</li>
                        <li>• DOMPurify HTML 净化</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-500" />
                        依赖安全（OWASP #6）
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• npm audit 定期扫描</li>
                        <li>• Snyk / Dependabot</li>
                        <li>• package-lock.json 锁定</li>
                        <li>• 最小依赖原则</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    部署前安全强制清单
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {[
                      "零处 SQL 注入：所有查询参数化",
                      "零处 eval / child_process.exec 拼接",
                      "零处硬编码密钥（gitleaks 扫描通过）",
                      "CSP / HSTS / X-Frame-Options 已配置",
                      "CSRF Token 覆盖所有状态变更路由",
                      "文件上传限制 MIME + 扩展名白名单",
                      "密码使用 bcrypt cost ≥ 12 或 argon2id",
                      "JWT expiresIn ≤ 1h，refresh ≤ 7d",
                      "npm audit 零高危或已评估修复",
                      "生产环境无 debug 模式 / console.log",
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
        <p>Node.js 安全审计报告 — 示例项目 | 技术栈：Express + SQLite</p>
        <p className="mt-1">
          审计维度：注入漏洞 / 敏感数据泄露 / XSS/CSRF / 认证安全 / 依赖安全 / 部署安全 | 共{" "}
          {totalItems} 项发现
        </p>
      </footer>
    </main>
  );
}
