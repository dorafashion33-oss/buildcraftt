import { useState, useRef, useEffect } from "react";
import { Menu, User, Inbox, Bell, HelpCircle, FileText, Moon, Users, LogOut, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface DashboardNavbarProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const DashboardNavbar = ({ onMenuClick, onProfileClick }: DashboardNavbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItems = [
    { icon: Inbox, label: "Inbox", hasArrow: true },
    { icon: Bell, label: "What's new", hasArrow: true, badge: true },
    { divider: true },
    { icon: User, label: "Profile", onClick: () => { navigate("/settings"); setProfileOpen(false); } },
    { icon: Settings, label: "Account settings", onClick: () => { navigate("/settings"); setProfileOpen(false); } },
    { icon: HelpCircle, label: "Support", hasArrow: true },
    { icon: FileText, label: "Documentation", hasArrow: true },
    { icon: Moon, label: "Appearance", hasArrow: true },
    { icon: Users, label: "Community" },
    { icon: LogOut, label: "Sign out", onClick: async () => { await signOut(); navigate("/"); } },
  ];

  return (
    <nav className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-40">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-muted-foreground hover:text-foreground">
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">B</span>
        </div>
        <span className="text-base font-bold tracking-tight bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
          BuildCraft
        </span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white relative"
        >
          {user?.email?.[0]?.toUpperCase() || "U"}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
            {/* User info */}
            <div className="p-4 flex items-center gap-3 border-b border-border/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {menuItems.map((item, i) => {
                if ('divider' in item) {
                  return <div key={i} className="my-1 border-t border-border/50" />;
                }
                const Icon = item.icon!;
                return (
                  <button
                    key={i}
                    onClick={item.onClick || (() => setProfileOpen(false))}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && <span className="w-2 h-2 rounded-full bg-destructive" />}
                    {item.hasArrow && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
