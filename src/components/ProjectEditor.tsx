import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Code, Copy, Download, Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    toast.success("Code copied!");
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
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-card/30 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-xs text-muted-foreground">
          <ArrowLeft className="w-3 h-3" /> Back
        </Button>
        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{project.prompt.slice(0, 40)}</span>
        <div className="flex-1" />
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
        <div className="w-px h-5 bg-border/50 mx-1" />
        <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
          <Copy className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
          <Download className="w-3 h-3" />
        </Button>
        <Button
          variant="hero"
          size="sm"
          onClick={() => { setDeployed(true); toast.success("🚀 Deployed!"); }}
          disabled={deployed}
          className="gap-1.5 text-xs"
        >
          <Rocket className="w-3 h-3" /> {deployed ? "Published ✓" : "Publish"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {viewMode === "preview" ? (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
            <iframe
              ref={iframeRef}
              srcDoc={generatedCode}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
              title="Live Preview"
            />
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
            <textarea
              value={editableCode}
              onChange={(e) => {
                setEditableCode(e.target.value);
                onCodeChange(e.target.value);
              }}
              className="w-full h-full bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-6 resize-none focus:outline-none"
              spellCheck={false}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;
