import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "@/components/AuthDialog";
import DemoDialog from "@/components/DemoDialog";

const HeroSection = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) navigate("/dashboard");
    else setAuthOpen(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-600/8 via-blue-600/5 to-transparent rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-orange-500/5 via-pink-500/5 to-transparent rounded-full blur-[100px]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-mono mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Now in Public Beta
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Build apps with
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">AI-powered</span> prompts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Describe what you want. Watch it build in real-time. Deploy in one click.
          From idea to production-ready app in minutes, not months.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={handleGetStarted}>
            Start Building Free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="hero-outline" size="lg" className="text-base px-8 py-6" onClick={() => setDemoOpen(true)}>
            Watch Demo
          </Button>
        </motion.div>

        {/* Editor preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-2xl shadow-purple-500/5">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--dot-warning))' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--dot-success))' }} />
              <span className="ml-3 text-xs font-mono text-muted-foreground">buildcraft — workspace</span>
            </div>
            <div className="flex min-h-[300px] sm:min-h-[340px]">
              <div className="w-48 border-r border-border/50 p-4 hidden md:block">
                <div className="space-y-2">
                  {["index.tsx", "Header.tsx", "Hero.tsx", "Features.tsx", "api/"].map((f, i) => (
                    <div key={f} className={`text-sm font-mono px-3 py-1.5 rounded-md ${i === 2 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-6 font-mono text-sm leading-7">
                <div className="text-muted-foreground">
                  <span className="text-accent">const</span>{" "}
                  <span className="text-primary">Hero</span>{" "}
                  <span className="text-muted-foreground">= () =&gt; {"{"}</span>
                </div>
                <div className="pl-4 text-muted-foreground">
                  <span className="text-accent">return</span> (
                </div>
                <div className="pl-8">
                  <span className="text-primary/70">&lt;section</span>{" "}
                  <span className="text-accent/70">className</span>=
                  <span style={{ color: 'hsl(var(--syntax-string))' }}>"hero"</span>
                  <span className="text-primary/70">&gt;</span>
                </div>
                <div className="pl-12">
                  <span className="text-primary/70">&lt;h1&gt;</span>
                  <span className="text-foreground/80">Build the future</span>
                  <span className="text-primary/70">&lt;/h1&gt;</span>
                </div>
                <motion.div
                  className="pl-12 inline-block"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                >
                  <span className="text-primary">▍</span>
                </motion.div>
              </div>
              <div className="w-64 border-l border-border/50 hidden lg:flex flex-col">
                <div className="px-3 py-2 border-b border-border/50 text-xs font-mono text-muted-foreground">Preview</div>
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-600/20 mx-auto mb-3 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">Live preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-purple-500/10 blur-[60px] rounded-full" />
        </motion.div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <DemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </section>
  );
};

export default HeroSection;
