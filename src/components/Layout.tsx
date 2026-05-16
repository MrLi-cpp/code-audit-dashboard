import { Link, useLocation } from "react-router";
import { Shield, ShieldAlert, Home, BookOpen, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "代码质量审查", icon: <Home className="w-4 h-4" /> },
    { path: "/security", label: "安全性审查", icon: <Shield className="w-4 h-4" /> },
    { path: "/examples", label: "质量示例", icon: <BookOpen className="w-4 h-4" /> },
    { path: "/security-examples", label: "安全示例", icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Node.js 代码审计
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  代码质量审查 &amp; 安全性审查
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Tech Stack Badge */}
            <Badge variant="outline" className="font-mono text-xs hidden md:flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              Express + SQLite
            </Badge>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {children}
    </div>
  );
}
