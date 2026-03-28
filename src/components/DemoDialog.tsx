import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, BarChart3, MessageSquare, Briefcase, Palette, GraduationCap, ArrowRight, Sparkles, X } from "lucide-react";

const demoIdeas = [
  { id: "ecommerce", icon: ShoppingCart, title: "E-Commerce Store", description: "A modern online shop with cart, checkout & product pages" },
  { id: "dashboard", icon: BarChart3, title: "Analytics Dashboard", description: "Real-time data visualization with charts & metrics" },
  { id: "chat", icon: MessageSquare, title: "Chat Application", description: "A messaging app with real-time conversations" },
  { id: "portfolio", icon: Briefcase, title: "Portfolio Website", description: "A sleek personal portfolio to showcase your work" },
  { id: "design", icon: Palette, title: "Design Agency", description: "A creative agency landing page with animations" },
  { id: "lms", icon: GraduationCap, title: "Learning Platform", description: "An online course platform with progress tracking" },
];

interface DemoPreview {
  title: string;
  sections: { label: string; color: string }[];
}

const demoPreviews: Record<string, DemoPreview> = {
  ecommerce: {
    title: "ShopFlow — E-Commerce",
    sections: [
      { label: "Hero Banner — Summer Sale 50% Off", color: "bg-primary/20" },
      { label: "Featured Products Grid (8 items)", color: "bg-accent/10" },
      { label: "Categories: Electronics, Fashion, Home", color: "bg-primary/10" },
      { label: "Customer Reviews — ★★★★★", color: "bg-accent/10" },
      { label: "Newsletter Signup + Footer", color: "bg-muted" },
    ],
  },
  dashboard: {
    title: "DataPulse — Analytics",
    sections: [
      { label: "KPI Cards: Revenue $48K | Users 12.4K | Growth +24%", color: "bg-primary/20" },
      { label: "Line Chart — Revenue Over Time", color: "bg-accent/10" },
      { label: "Bar Chart — Users by Region", color: "bg-primary/10" },
      { label: "Table — Recent Transactions", color: "bg-accent/10" },
      { label: "Activity Feed + Notifications", color: "bg-muted" },
    ],
  },
  chat: {
    title: "ChatNow — Messaging",
    sections: [
      { label: "Sidebar — Conversations List", color: "bg-primary/20" },
      { label: "Chat Header — John Doe (Online)", color: "bg-accent/10" },
      { label: "Message Bubbles — Back & Forth", color: "bg-primary/10" },
      { label: "Typing Indicator...", color: "bg-accent/10" },
      { label: "Input Bar — Type a message + Send", color: "bg-muted" },
    ],
  },
  portfolio: {
    title: "DevFolio — Portfolio",
    sections: [
      { label: "Hero — Hi, I'm Alex. Full-Stack Developer.", color: "bg-primary/20" },
      { label: "About Me + Skills Grid", color: "bg-accent/10" },
      { label: "Projects Showcase — 6 Projects", color: "bg-primary/10" },
      { label: "Testimonials Carousel", color: "bg-accent/10" },
      { label: "Contact Form + Social Links", color: "bg-muted" },
    ],
  },
  design: {
    title: "Pixel Studio — Agency",
    sections: [
      { label: "Hero — We Design Digital Experiences", color: "bg-primary/20" },
      { label: "Services: Branding, Web, Mobile, Motion", color: "bg-accent/10" },
      { label: "Case Studies Gallery", color: "bg-primary/10" },
      { label: "Team Members Grid", color: "bg-accent/10" },
      { label: "Get In Touch CTA + Footer", color: "bg-muted" },
    ],
  },
  lms: {
    title: "LearnHub — Education",
    sections: [
      { label: "Hero — Learn Anything, Anywhere", color: "bg-primary/20" },
      { label: "Popular Courses — 8 Cards", color: "bg-accent/10" },
      { label: "Progress Dashboard — 3 Active Courses", color: "bg-primary/10" },
      { label: "Instructor Profiles", color: "bg-accent/10" },
      { label: "Pricing Plans + FAQ", color: "bg-muted" },
    ],
  },
};

interface DemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoDialog = ({ open, onOpenChange }: DemoDialogProps) => {
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedIdea(id);
    setBuilding(true);
    setBuilt(false);
    // Simulate build
    setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
    }, 2500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedIdea(null);
      setBuilding(false);
      setBuilt(false);
    }, 300);
  };

  const preview = selectedIdea ? demoPreviews[selectedIdea] : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {!selectedIdea ? "Choose an app to build" : building ? "Building your app..." : preview?.title}
          </DialogTitle>
          {!selectedIdea && (
            <p className="text-sm text-muted-foreground text-center">
              Pick an idea and watch AI generate it in seconds
            </p>
          )}
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!selectedIdea ? (
            <motion.div
              key="ideas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
            >
              {demoIdeas.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => handleSelect(idea.id)}
                  className="group gradient-border rounded-xl p-5 bg-card hover:bg-elevated transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <idea.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{idea.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{idea.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              {/* Mock browser window */}
              <div className="gradient-border rounded-xl overflow-hidden bg-background">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(var(--dot-warning))' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(var(--dot-success))' }} />
                  <div className="flex-1 mx-4">
                    <div className="bg-muted rounded-md px-3 py-1 text-xs font-mono text-muted-foreground text-center">
                      {preview?.title?.toLowerCase().replace(/\s/g, '') + ".buildcraft.app"}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 min-h-[280px]">
                  {preview?.sections.map((section, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={building ? { opacity: [0, 1], x: [-20, 0] } : { opacity: 1, x: 0 }}
                      transition={{ delay: building ? i * 0.4 : 0, duration: 0.5 }}
                      className={`${section.color} rounded-lg p-4 border border-border/50`}
                    >
                      <div className="flex items-center gap-2">
                        {building && i === Math.min(Math.floor(Date.now() / 500) % 5, 4) ? (
                          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                        ) : null}
                        <span className="text-xs font-mono text-muted-foreground">{section.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {built && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between"
                >
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--dot-success))' }} />
                    Built successfully in 2.5s
                  </p>
                  <div className="flex gap-2">
                    <Button variant="hero-outline" size="sm" onClick={() => { setSelectedIdea(null); setBuilt(false); }}>
                      Try Another
                    </Button>
                    <Button variant="hero" size="sm" onClick={handleClose}>
                      Start Building
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default DemoDialog;
