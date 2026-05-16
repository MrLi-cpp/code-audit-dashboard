import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Shield,
  Zap,
  Code2,
  ChevronRight,
  FileSearch,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { AuditItem, Severity } from "@/types/audit";

const severityConfig = {
  critical: {
    label: "严重",
    badgeClass: "severity-badge-critical",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  warning: {
    label: "建议",
    badgeClass: "severity-badge-warning",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  info: {
    label: "提示",
    badgeClass: "severity-badge-info",
    icon: <Info className="w-4 h-4" />,
  },
};

function SeverityBadge({ severity }: { severity: Severity }) {
  const config = severityConfig[severity];
  return (
    <span className={config.badgeClass}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function AuditItemCard({
  item,
  onToggle,
}: {
  item: AuditItem;
  onToggle?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border transition-all duration-200 ${
        item.checked
          ? "border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800"
          : "bg-card hover:border-primary/20"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {onToggle && (
            <Checkbox
              checked={item.checked}
              onCheckedChange={onToggle}
              className="mt-1"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <SeverityBadge severity={item.severity} />
              <span className="text-xs text-muted-foreground font-mono">
                {item.id.toUpperCase()}
              </span>
            </div>
            <h3
              className={`mt-2 text-base font-semibold leading-snug ${
                item.checked ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <FileSearch className="w-3.5 h-3.5 shrink-0" />
              <code className="text-xs">{item.location}</code>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors shrink-0"
          >
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        {expanded && (
          <div className="mt-5 space-y-4 pl-8">
            <Separator />
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                问题描述
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                影响评估
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.impact}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                操作建议
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {item.action}
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                代码片段
              </h4>
              <pre className="code-block text-xs leading-relaxed">
                <code>{item.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
