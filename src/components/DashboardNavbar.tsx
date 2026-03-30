import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardNavbarProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const DashboardNavbar = ({ onMenuClick, onProfileClick }: DashboardNavbarProps) => {
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

      <Button variant="ghost" size="icon" onClick={onProfileClick} className="text-muted-foreground hover:text-foreground">
        <User className="w-5 h-5" />
      </Button>
    </nav>
  );
};

export default DashboardNavbar;
