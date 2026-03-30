import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border/50 flex items-center px-4 gap-3 bg-background/80 backdrop-blur-xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="text-base font-semibold text-foreground">Settings</h1>
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-8">
        {/* Profile */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="text-sm font-medium text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">{darkMode ? "Dark mode" : "Light mode"}</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={async () => { await signOut(); navigate("/"); }}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
