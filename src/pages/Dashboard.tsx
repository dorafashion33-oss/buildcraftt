import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Mic, ArrowUp, Lock, Sparkles } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectCard from "@/components/ProjectCard";
import ProjectEditor from "@/components/ProjectEditor";
import { useNavigate } from "react-router-dom";

const MAX_FREE_GENERATIONS = 5;

interface Project {
  id: string;
  prompt: string;
  generated_code: string;
  created_at: string;
}

const TEMPLATES = [
  { title: "SaaS Landing Page", desc: "Modern hero, pricing, features, testimonials", prompt: "A modern SaaS landing page with hero section, features grid, pricing table, testimonials, and CTA" },
  { title: "E-Commerce Store", desc: "Product grid, cart, categories", prompt: "An e-commerce store with product grid, category filters, shopping cart, and checkout" },
  { title: "Portfolio Website", desc: "Projects showcase, about, contact", prompt: "A creative portfolio website with project showcase, about section, skills, and contact form" },
  { title: "Blog Platform", desc: "Articles, sidebar, newsletter", prompt: "A modern blog platform with article cards, sidebar, categories, and newsletter signup" },
  { title: "Dashboard UI", desc: "Charts, stats, tables", prompt: "An analytics dashboard with charts, stat cards, data tables, and sidebar navigation" },
  { title: "Restaurant Site", desc: "Menu, reservations, gallery", prompt: "A restaurant website with menu, reservation form, photo gallery, and location map" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "recent" | "templates">("projects");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const usageCount = projects.length;
  const limitReached = usageCount >= MAX_FREE_GENERATIONS;

  const handleGenerate = async (input?: string) => {
    const text = input || prompt;
    if (!text.trim()) return toast.error("Please describe your app idea");
    if (limitReached) return toast.error("Free limit reached! Upgrade to continue.");
    setGenerating(true);
    setGeneratedCode("");
    setSelectedProject(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please sign in"); return; }

      const { data, error } = await supabase.functions.invoke("generate-app", {
        body: { prompt: text.trim() },
      });
      if (error) throw new Error(error.message || "Generation failed");

      const code = data?.code || "";
      if (!code) throw new Error("No code generated. Try again.");

      setGeneratedCode(code);

      const { data: project, error: dbError } = await supabase
        .from("projects")
        .insert({ user_id: user!.id, prompt: text.trim(), generated_code: code })
        .select()
        .single();

      if (dbError) throw dbError;
      if (project) {
        setSelectedProject(project);
        setProjects(prev => [project, ...prev]);
      }

      toast.success("App generated!");
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
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setGeneratedCode("");
    setPrompt("");
  };

  const tabs = [
    { key: "projects" as const, label: "My Projects" },
    { key: "recent" as const, label: "Recently Viewed" },
    { key: "templates" as const, label: "Templates" },
  ];

  // If a project is selected or generating, show editor view
  if (selectedProject || generating) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} onProfileClick={() => navigate("/settings")} />
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          projects={projects}
          onSelectProject={handleSelectProject}
          onNewProject={handleNewProject}
        />
        <ProjectEditor
          project={selectedProject || { id: "", prompt: prompt, generated_code: "", created_at: new Date().toISOString() }}
          generatedCode={generatedCode}
          generating={generating}
          onBack={handleNewProject}
          onCodeChange={setGeneratedCode}
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-600/10 via-blue-600/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-orange-500/5 via-pink-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} onProfileClick={() => navigate("/settings")} />
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 relative z-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            What's on your mind?
          </h1>
        </motion.div>

        {/* Input box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl mb-8"
        >
          <div className="relative flex items-center rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-lg shadow-black/10 hover:border-border transition-colors">
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Describe your app or website idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={limitReached}
              className="flex-1 bg-transparent border-0 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none py-4 pr-2"
            />
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleGenerate()}
              disabled={!prompt.trim() || limitReached || generating}
              className="m-1.5 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
          {limitReached && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1 justify-center">
              <Lock className="w-3 h-3" /> Free limit reached — upgrade to continue
            </p>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 backdrop-blur-sm mb-8"
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-5xl pb-12"
        >
          {activeTab === "templates" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map(t => (
                <button
                  key={t.title}
                  onClick={() => { setPrompt(t.prompt); handleGenerate(t.prompt); }}
                  className="group text-left rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 hover:bg-card/60 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-purple-600/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          ) : (
            projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No projects yet. Describe your idea above to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(p => (
                  <ProjectCard key={p.id} project={p} onClick={() => handleSelectProject(p)} />
                ))}
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
