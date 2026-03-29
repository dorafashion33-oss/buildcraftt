import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, LogOut, Code, Eye, Copy, Download, Rocket,
  Plus, Loader2, Clock, Zap, Lock, ChevronRight
} from "lucide-react";

const MAX_FREE_GENERATIONS = 5;

interface Project {
  id: string;
  prompt: string;
  generated_code: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [generatedCode, setGeneratedCode] = useState("");
  const [editableCode, setEditableCode] = useState("");
  const [deployed, setDeployed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
    if (error) console.error(error);
  };

  const usageCount = projects.length;
  const limitReached = usageCount >= MAX_FREE_GENERATIONS;

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please describe your app idea");
    if (limitReached) return toast.error("Free limit reached! Upgrade to continue.");
    setGenerating(true);
    setGeneratedCode("");
    setEditableCode("");
    setSelectedProject(null);
    setViewMode("preview");
    setDeployed(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in first");
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-app", {
        body: { prompt: prompt.trim() },
      });

      if (error) throw new Error(error.message || "Generation failed");

      const code = data?.code || "";
      if (!code) throw new Error("No code was generated. Please try again.");

      setGeneratedCode(code);
      setEditableCode(code);

      // Save to DB
      const { data: project, error: dbError } = await supabase
        .from("projects")
        .insert({ user_id: user!.id, prompt: prompt.trim(), generated_code: code })
        .select()
        .single();

      if (dbError) throw dbError;
      if (project) {
        setSelectedProject(project);
        setProjects(prev => [project, ...prev]);
      }

      toast.success("App generated successfully!");
      setPrompt("");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setGeneratedCode(project.generated_code);
    setEditableCode(project.generated_code);
    setViewMode("preview");
    setDeployed(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    toast.success("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([editableCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-app.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleDeploy = () => {
    setDeployed(true);
    toast.success("🚀 App deployed successfully!");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/50 bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">BuildCraft</span>
          </div>
          <Button
            onClick={() => { setSelectedProject(null); setGeneratedCode(""); setEditableCode(""); setPrompt(""); }}
            variant="hero"
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        {/* Usage */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Usage</span>
            <span>{usageCount}/{MAX_FREE_GENERATIONS}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(usageCount / MAX_FREE_GENERATIONS) * 100}%` }}
            />
          </div>
          {limitReached && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Upgrade to unlock more
            </p>
          )}
        </div>

        {/* Projects */}
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-wider">Projects</p>
          {projects.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">No projects yet</p>
          ) : (
            projects.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors flex items-center gap-2 group ${
                  selectedProject?.id === p.id ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <Clock className="w-3 h-3 shrink-0 text-muted-foreground" />
                <span className="truncate flex-1">{p.prompt.slice(0, 40)}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>

        {/* User */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} className="shrink-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        {(generatedCode || generating) && (
          <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-card/30">
            <Button
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="gap-1.5 text-xs"
            >
              <Eye className="w-3 h-3" /> Preview
            </Button>
            <Button
              variant={viewMode === "code" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("code")}
              className="gap-1.5 text-xs"
            >
              <Code className="w-3 h-3" /> Code
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
              <Copy className="w-3 h-3" /> Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
              <Download className="w-3 h-3" /> Download
            </Button>
            <Button
              variant="hero"
              size="sm"
              onClick={handleDeploy}
              disabled={deployed}
              className="gap-1.5 text-xs"
            >
              <Rocket className="w-3 h-3" /> {deployed ? "Deployed ✓" : "Deploy"}
            </Button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {!generatedCode && !generating ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center h-full p-8"
              >
                <div className="max-w-2xl w-full space-y-6 text-center">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">What do you want to build?</h1>
                    <p className="text-muted-foreground">Describe your app idea and AI will generate it instantly.</p>
                  </div>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="e.g., A modern portfolio website for a photographer with a gallery, about section, and contact form..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] bg-card border-border/50 text-base resize-none"
                      disabled={limitReached}
                    />
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={handleGenerate}
                      disabled={generating || limitReached || !prompt.trim()}
                      className="w-full gap-2 h-12 text-base"
                    >
                      {limitReached ? (
                        <><Lock className="w-4 h-4" /> Upgrade to Generate</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Generate App</>
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {["SaaS landing page", "E-commerce store", "Portfolio website", "Blog platform"].map(idea => (
                      <button
                        key={idea}
                        onClick={() => setPrompt(idea)}
                        className="px-3 py-1.5 rounded-full text-xs border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : generating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                  <div>
                    <p className="text-lg font-semibold">Building your app...</p>
                    <p className="text-sm text-muted-foreground">AI is generating your website. This may take 15-30 seconds.</p>
                  </div>
                </div>
              </motion.div>
            ) : viewMode === "preview" ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={generatedCode}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                  title="Live Preview"
                />
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <textarea
                  value={editableCode}
                  onChange={(e) => {
                    setEditableCode(e.target.value);
                    setGeneratedCode(e.target.value);
                  }}
                  className="w-full h-full bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-6 resize-none focus:outline-none"
                  spellCheck={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
