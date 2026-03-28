import { motion } from "framer-motion";
import { Zap, Eye, MousePointer, Globe, MessageSquare, Rocket, Users, Code2 } from "lucide-react";

const features = [
  { icon: Zap, title: "AI Code Generation", description: "Describe your app in plain language. Our AI writes production-ready code instantly." },
  { icon: Eye, title: "Live Preview", description: "See every change in real-time. No more guessing — what you see is what ships." },
  { icon: MousePointer, title: "Drag & Drop Editor", description: "Visually compose layouts. Move, resize, and style components without code." },
  { icon: Globe, title: "Multi-Language", description: "Build for a global audience with built-in i18n and localization support." },
  { icon: MessageSquare, title: "AI Chat Assistance", description: "Ask questions, debug issues, and iterate on designs through natural conversation." },
  { icon: Rocket, title: "One-Click Deploy", description: "Ship to production with a single click. Custom domains, SSL, and CDN included." },
  { icon: Users, title: "Team Management", description: "Collaborate with your team in real-time. Roles, permissions, and shared workspaces." },
  { icon: Code2, title: "Pro-Code Access", description: "Full code access when you need it. Export, customize, and extend without limits." },
];

const FeaturesSection = () => {
  return (
    <section className="py-32 px-6 relative" id="features">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary tracking-widest uppercase">Features</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
            Everything you need to <span className="gradient-text">ship fast</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A complete platform for building, previewing, and deploying web applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group gradient-border rounded-xl p-6 bg-card hover:bg-elevated transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
