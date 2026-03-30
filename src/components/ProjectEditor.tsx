import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Code, Copy, Download, Rocket, Loader2, Send, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProjectEditorProps {
  project: {
    id: string;
    prompt: string;
    generated_code: string;
    created_at: string;
  };
  generatedCode: string;
  generating: boolean;
  onBack: () => void;
  onCodeChange: (code: string) => void;
}

const ProjectEditor = ({ project, generatedCode, generating, onBack, onCodeChange }: ProjectEditorProps) => {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [editableCode, setEditableCode] = useState(generatedCode);
  const [deployed, setDeployed] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode || generatedCode);
    toast.success("Code copied!");
  };

  const handleDownload = () => {
    const blob = new Blob([editableCode || generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-app.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please sign in"); return; }

      const { data, error } = await supabase.functions.invoke("generate-app", {
        body: {
          prompt: `Here is the current HTML code of the app:\n\n${editableCode || generatedCode}\n\nThe user wants the following change: "${userMsg}"\n\nPlease return the COMPLETE updated HTML code with the change applied. Return ONLY the full HTML code, no explanation.`,
        },
      });

      if (error) throw new Error(error.message);
      const code = data?.code || "";
      if (!code) throw new Error("No code generated");

      setEditableCode(code);
      onCodeChange(code);
      setChatMessages(prev => [...prev, { role: "assistant", content: "Changes applied! Check the preview." }]);

      // Update in DB if project has an id
      if (project.id) {
        await supabase.from("projects").update({ generated_code: code }).eq("id", project.id);
      }
    } catch (e: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (generating) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <div>
            <p className="text-lg font-semibold text-foreground">Building your app...</p>
            <p className="text-sm text-muted-foreground">AI is generating your website. This may take 15-30 seconds.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="h-11 border-b border-border/50 flex items-center px-2 sm:px-4 gap-1 sm:gap-2 bg-card/30 backdrop-blur-sm shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-xs text-muted-foreground px-2">
          <ArrowLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-[200px]">
            {project.prompt.slice(0, 30)}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="gap-1 text-xs px-2 h-7"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant={viewMode === "code" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("code")}
            className="gap-1 text-xs px-2 h-7"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">Code</span>
          </Button>
          <div className="w-px h-4 bg-border/50 mx-0.5 hidden sm:block" />
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs px-2 h-7">
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="text-xs px-2 h-7">
            <Download className="w-3 h-3" />
          </Button>
          <Button
            variant="hero"
            size="sm"
            onClick={() => { setDeployed(true); toast.success("🚀 Deployed!"); }}
            disabled={deployed}
            className="gap-1 text-xs px-2 sm:px-3 h-7"
          >
            <Rocket className="w-3 h-3" />
            <span className="hidden sm:inline">{deployed ? "Published ✓" : "Publish"}</span>
          </Button>
        </div>
      </div>

      {/* Main content area - preview takes full remaining space */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 relative min-h-0">
          {viewMode === "preview" ? (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
              <iframe
                ref={iframeRef}
                srcDoc={editableCode || generatedCode}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
                title="Live Preview"
              />
            </motion.div>
          ) : (
            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
              <textarea
                value={editableCode || generatedCode}
                onChange={(e) => {
                  setEditableCode(e.target.value);
                  onCodeChange(e.target.value);
                }}
                className="w-full h-full bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-4 resize-none focus:outline-none"
                spellCheck={false}
              />
            </motion.div>
          )}
        </div>

        {/* Chat input for making changes */}
        <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
          {/* Chat messages */}
          {chatMessages.length > 0 && (
            <div className="max-h-32 overflow-y-auto px-3 py-2 space-y-2">
              {chatMessages.slice(-4).map((msg, i) => (
                <div key={i} className={`text-xs ${msg.role === "user" ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="font-medium">{msg.role === "user" ? "You" : "AI"}: </span>
                  {msg.content}
                </div>
              ))}
            </div>
          )}
          <div className="p-2 sm:p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/80 px-3 py-2">
              <button className="text-muted-foreground hover:text-foreground shrink-0">
                <Plus className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Ask BuildCraft to make changes..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
                disabled={chatLoading}
                className="flex-1 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
              />
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || chatLoading}
                className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
              >
                {chatLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
