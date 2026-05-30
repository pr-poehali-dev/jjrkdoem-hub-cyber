import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import FavoritesPage from "./pages/FavoritesPage";
import RulesPage from "./pages/RulesPage";
import SupportPage from "./pages/SupportPage";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import { User } from "./types";

export type Page = "home" | "catalog" | "profile" | "messages" | "favorites" | "rules" | "support";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  const navigate = (p: Page) => {
    if ((p === "profile" || p === "messages" || p === "favorites") && !user) {
      openAuth("login");
      return;
    }
    setPage(p);
  };

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
        <div className="scanline-overlay" />

        <Navbar
          page={page}
          user={user}
          onNavigate={navigate}
          onOpenAuth={openAuth}
          onLogout={handleLogout}
        />

        <main className="pt-16">
          {page === "home" && <HomePage onNavigate={navigate} onOpenAuth={openAuth} user={user} />}
          {page === "catalog" && <CatalogPage user={user} onOpenAuth={openAuth} />}
          {page === "profile" && user && <ProfilePage user={user} setUser={setUser} />}
          {page === "messages" && user && <MessagesPage user={user} />}
          {page === "favorites" && user && <FavoritesPage />}
          {page === "rules" && <RulesPage />}
          {page === "support" && <SupportPage user={user} />}
        </main>

        {authOpen && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthOpen(false)}
            onLogin={handleLogin}
            onSwitchMode={(m) => setAuthMode(m)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
