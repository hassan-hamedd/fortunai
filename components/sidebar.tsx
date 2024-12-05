"use client";

import { useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight, FileText, Home, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/tax-forms", label: "Tax Forms", icon: FileText },
  ];

  return (
    <div
      className={cn(
        "relative h-screen border-r bg-muted/10 transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={() => setExpanded(x => !x)}
      >
        {expanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className={cn(
            "flex h-12 items-center justify-center rounded-md bg-primary text-primary-foreground",
            expanded ? "px-3" : "px-0"
          )}>
            {expanded ? (
              <h2 className="text-lg font-semibold">FortunAI</h2>
            ) : (
              <FileText className="h-6 w-6" />
            )}
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !expanded && "justify-center px-2"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4",
                      expanded && "mr-2",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {expanded && <span>{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-3">
        <div className={cn(
          "flex items-center justify-center rounded-md p-2",
          expanded && "justify-between"
        )}>
          {expanded && <span className="text-sm text-muted-foreground">Account</span>}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}