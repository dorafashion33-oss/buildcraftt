const FooterSection = () => {
  return (
    <footer className="border-t border-border/50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">B</span>
          </div>
          <span className="font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">BuildCraft</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 BuildCraft. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
