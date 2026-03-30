import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Home, Plus, Clock, FolderOpen, Star, UserCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  prompt: string;
  generated_code: string;
  created_at: string;
}

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

const DashboardSidebar = ({ open, onClose, projects, onSelectProject, onNewProject }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter(p =>
    p.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-xl border-r border-border/50 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
                <span className="font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">BuildCraft</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-muted/50 border-border/50 text-sm"
                />
              </div>
            </div>

            {/* Nav items */}
            <div className="px-3 space-y-0.5">
              <button
                onClick={() => { onNewProject(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                <Home className="w-4 h-4 text-muted-foreground" />
                Home
              </button>
              <button
                onClick={() => { onNewProject(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create new project
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto px-3 mt-4 space-y-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-1.5">Recent Projects</p>
                {filteredProjects.slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onSelectProject(p); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{p.prompt.slice(0, 35)}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  All Projects
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  Starred
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors">
                  <UserCircle className="w-4 h-4 text-muted-foreground" />
                  Created by me
                </button>
              </div>
            </div>

            {/* Bottom profile */}
            <div className="p-4 border-t border-border/50 space-y-2">
              <button
                onClick={() => { navigate("/settings"); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                Settings
              </button>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}'s BuildCraft</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut} className="shrink-0 text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default DashboardSidebar;
