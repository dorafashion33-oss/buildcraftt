import { Sparkles } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-foreground">BuildCraft</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 BuildCraft. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
