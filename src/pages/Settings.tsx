import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings as SettingsIcon, Globe, Users, CreditCard, BarChart3, Shield, User, FlaskConical, BookOpen, LogOut, Moon, Sun, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  const sections = [
    {
      title: "Project",
      items: [
        { icon: SettingsIcon, label: "Project settings" },
        { icon: Globe, label: "Domains" },
      ]
    },
    {
      title: "Workspace",
      items: [
        { icon: User, label: `${user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}'s BuildCraft`, isProfile: true },
        { icon: Users, label: "People" },
        { icon: CreditCard, label: "Plans & credits" },
        { icon: BarChart3, label: "Cloud & AI balance" },
        { icon: Shield, label: "Privacy & security" },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: User, label: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User" },
        { icon: FlaskConical, label: "Labs" },
      ]
    },
    {
      title: "Knowledge",
      items: [
        { icon: BookOpen, label: "Knowledge" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border/50 flex items-center px-4 gap-3 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base font-semibold text-foreground flex-1 text-center pr-10">Settings</h1>
      </div>

      <div className="max-w-lg mx-auto pb-12">
        {sections.map((section) => (
          <div key={section.title} className="mt-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 mb-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm text-foreground hover:bg-muted/30 transition-colors"
                >
                  {item.isProfile ? (
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  ) : (
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Appearance toggle */}
        <div className="mt-6 px-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-4 py-3.5 text-sm text-foreground"
          >
            {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
            <span className="flex-1 text-left">Appearance</span>
            <span className="text-xs text-muted-foreground">{darkMode ? "Dark" : "Light"}</span>
          </button>
        </div>

        {/* Sign out */}
        <div className="mt-8 px-6">
          <Button
            variant="outline"
            className="w-full gap-3 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={async () => { await signOut(); navigate("/"); }}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
