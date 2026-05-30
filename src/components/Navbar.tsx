import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "../types";
import { Page } from "../App";

interface NavbarProps {
  page: Page;
  user: User | null;
  onNavigate: (p: Page) => void;
  onOpenAuth: (mode: "login" | "register") => void;
  onLogout: () => void;
}

export default function Navbar({ page, user, onNavigate, onOpenAuth, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { id: Page; label: string; icon: string; authRequired?: boolean }[] = [
    { id: "home", label: "ГЛАВНАЯ", icon: "Zap" },
    { id: "catalog", label: "КАТАЛОГ", icon: "LayoutGrid" },
    { id: "favorites", label: "ИЗБРАННОЕ", icon: "Heart", authRequired: true },
    { id: "messages", label: "СООБЩЕНИЯ", icon: "MessageSquare", authRequired: true },
    { id: "rules", label: "ПРАВИЛА", icon: "Shield" },
    { id: "support", label: "ПОДДЕРЖКА", icon: "LifeBuoy" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(8,8,16,0.95)",
        borderBottom: "1px solid rgba(0,245,255,0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 20px rgba(0,245,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              border: "1px solid var(--neon-cyan)",
              boxShadow: "0 0 10px rgba(0,245,255,0.4)",
              background: "rgba(0,245,255,0.05)",
            }}
          >
            <span style={{ color: "var(--neon-cyan)", fontSize: "14px", fontFamily: "Orbitron" }}>⬡</span>
          </div>
          <span
            className="font-orbitron font-black text-sm tracking-wider hidden sm:block"
            style={{ color: "var(--neon-cyan)", textShadow: "0 0 8px var(--neon-cyan)" }}
          >
            JJRKDOEM<span style={{ color: "var(--neon-purple)" }}>`</span>HUB
            <span
              className="ml-1 px-1"
              style={{
                background: "var(--neon-purple)",
                color: "#000",
                fontSize: "10px",
                fontWeight: 900,
              }}
            >QQ</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-rajdhani font-semibold tracking-widest transition-all duration-200"
              style={{
                color: page === l.id ? "var(--neon-cyan)" : "rgba(0,245,255,0.5)",
                textShadow: page === l.id ? "0 0 8px var(--neon-cyan)" : "none",
                borderBottom: page === l.id ? "1px solid var(--neon-cyan)" : "1px solid transparent",
              }}
            >
              <Icon name={l.icon} size={13} />
              {l.label}
            </button>
          ))}
        </div>

        {/* User / Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {user.isAdmin && (
                <span
                  className="hidden sm:block text-xs font-mono px-2 py-0.5"
                  style={{
                    color: "var(--neon-yellow)",
                    border: "1px solid var(--neon-yellow)",
                    fontSize: "10px",
                  }}
                >
                  ADMIN
                </span>
              )}
              <button
                onClick={() => onNavigate("profile")}
                className="flex items-center gap-2 px-2 py-1 transition-all"
                style={{
                  border: "1px solid rgba(0,245,255,0.3)",
                  color: "var(--neon-cyan)",
                }}
              >
                <div
                  className="w-6 h-6 flex items-center justify-center text-xs font-orbitron font-bold"
                  style={{ background: "rgba(0,245,255,0.15)", color: "var(--neon-cyan)" }}
                >
                  {user.displayName[0].toUpperCase()}
                </div>
                <span className="text-xs font-rajdhani font-semibold tracking-wider hidden sm:block">
                  {user.displayName}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="p-2 transition-all"
                style={{ color: "rgba(255,0,100,0.6)" }}
                title="Выйти"
              >
                <Icon name="LogOut" size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth("login")}
                className="cyber-btn text-xs py-1.5 px-3"
              >
                ВОЙТИ
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="cyber-btn cyber-btn-purple text-xs py-1.5 px-3 hidden sm:block"
              >
                РЕГИСТРАЦИЯ
              </button>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--neon-cyan)" }}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: "rgba(8,8,16,0.98)",
            borderTop: "1px solid rgba(0,245,255,0.15)",
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { onNavigate(l.id); setMobileOpen(false); }}
              className="flex items-center gap-3 w-full px-6 py-3 text-sm font-rajdhani font-semibold tracking-widest"
              style={{
                color: page === l.id ? "var(--neon-cyan)" : "rgba(0,245,255,0.5)",
                borderBottom: "1px solid rgba(0,245,255,0.06)",
              }}
            >
              <Icon name={l.icon} size={16} />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}