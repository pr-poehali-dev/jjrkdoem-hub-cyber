import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "../components/ProductCard";
import { MOCK_PRODUCTS } from "../data/mockData";
import { Page } from "../App";
import { User } from "../types";

interface HomePageProps {
  onNavigate: (p: Page) => void;
  onOpenAuth: (mode: "login" | "register") => void;
  user: User | null;
}

const STATS = [
  { value: "2 847", label: "АКТИВНЫХ ЛОТОВ" },
  { value: "12 391", label: "ПОЛЬЗОВАТЕЛЕЙ" },
  { value: "98.4%", label: "УСПЕШНЫХ СДЕЛОК" },
  { value: "< 5 МИН", label: "СРЕДНЕЕ ВРЕМЯ ОТВЕТА" },
];

const CATEGORIES = [
  { icon: "Key", label: "Ключи", sub: "Steam, Epic, GOG, Uplay", color: "var(--neon-cyan)" },
  { icon: "User", label: "Аккаунты", sub: "Любые игры и платформы", color: "var(--neon-purple)" },
  { icon: "Sword", label: "Предметы", sub: "Скины, оружие, кейсы", color: "#ff9500" },
  { icon: "Gamepad2", label: "Игры", sub: "Полные версии, DLC", color: "#00ff88" },
  { icon: "Coins", label: "Валюта", sub: "В-баксы, голд, кредиты", color: "var(--neon-yellow)" },
];

export default function HomePage({ onNavigate, onOpenAuth, user }: HomePageProps) {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,245,255,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(191,0,255,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Decorative lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.1), transparent)" }} />
          <div className="absolute bottom-32 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(191,0,255,0.1), transparent)" }} />
          <div className="absolute top-0 left-1/3 w-px h-full" style={{ background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.05), transparent)" }} />
          <div className="absolute top-0 right-1/3 w-px h-full" style={{ background: "linear-gradient(180deg, transparent, rgba(191,0,255,0.05), transparent)" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--neon-cyan)" }} />
            <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(0,245,255,0.6)" }}>
              СИСТЕМА ОНЛАЙН — ГОТОВ К ТОРГОВЛЕ
            </span>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--neon-cyan)" }} />
          </div>

          {/* Main Title */}
          <h1
            className={`font-orbitron font-black mb-2 leading-none ${glitchActive ? "glitch-text" : ""}`}
            data-text="JJRKDOEM`HUB QQ"
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              color: "var(--neon-cyan)",
              textShadow: "0 0 30px rgba(0,245,255,0.5), 0 0 60px rgba(0,245,255,0.2)",
              letterSpacing: "0.05em",
            }}
          >
            JJRKDOEM<span style={{ color: "var(--neon-purple)" }}>`</span>HUB{" "}
            <span
              style={{
                background: "var(--neon-purple)",
                color: "#000",
                padding: "0 12px",
                fontWeight: 900,
              }}
            >QQ</span>
          </h1>

          <p
            className="font-rajdhani font-medium text-xl md:text-2xl mb-4 tracking-widest"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            МАРКЕТПЛЕЙС ИГРОВЫХ ПРЕДМЕТОВ
          </p>
          <p
            className="font-rajdhani text-base md:text-lg mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(0,245,255,0.4)" }}
          >
            Ключи · Аккаунты · Предметы · Игры · Валюта
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("catalog")}
              className="cyber-btn cyber-btn-filled px-8 py-3 text-sm"
            >
              <span className="flex items-center gap-2">
                <Icon name="LayoutGrid" size={16} />
                ОТКРЫТЬ КАТАЛОГ
              </span>
            </button>
            {!user && (
              <button
                onClick={() => onOpenAuth("register")}
                className="cyber-btn cyber-btn-purple px-8 py-3 text-sm"
              >
                <span className="flex items-center gap-2">
                  <Icon name="UserPlus" size={16} />
                  РЕГИСТРАЦИЯ
                </span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="py-4 px-3"
                style={{
                  border: "1px solid rgba(0,245,255,0.1)",
                  background: "rgba(0,245,255,0.02)",
                }}
              >
                <div
                  className="font-orbitron font-black text-xl mb-1"
                  style={{ color: "var(--neon-cyan)" }}
                >
                  {s.value}
                </div>
                <div className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.35)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
          <h2 className="font-orbitron font-bold text-lg tracking-widest" style={{ color: "var(--neon-cyan)" }}>
            КАТЕГОРИИ
          </h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(0,245,255,0.3), transparent)" }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onNavigate("catalog")}
              className="cyber-card p-4 text-left group hover-scale"
            >
              <div className="mb-3" style={{ color: cat.color }}>
                <Icon name={cat.icon} size={24} />
              </div>
              <div className="font-rajdhani font-bold text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                {cat.label}
              </div>
              <div className="font-rajdhani text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {cat.sub}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* HOT LOTS */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-6 h-px" style={{ background: "var(--neon-purple)" }} />
            <h2 className="font-orbitron font-bold text-lg tracking-widest" style={{ color: "var(--neon-purple)" }}>
              ГОРЯЧИЕ ЛОТЫ
            </h2>
          </div>
          <button
            onClick={() => onNavigate("catalog")}
            className="font-mono text-xs tracking-wider transition-all"
            style={{ color: "rgba(0,245,255,0.5)" }}
          >
            ВСЕ ЛОТЫ →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div
          className="relative p-8 md:p-12 overflow-hidden"
          style={{
            border: "1px solid rgba(191,0,255,0.3)",
            background: "linear-gradient(135deg, rgba(191,0,255,0.05) 0%, rgba(0,245,255,0.03) 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, rgba(191,0,255,0.1), transparent 70%)",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="font-mono text-xs mb-2" style={{ color: "rgba(191,0,255,0.5)" }}>
                // ХОЧЕШЬ ПРОДАВАТЬ?
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>
                РАЗМЕСТИ СВОИ ЛОТЫ
              </h3>
              <p className="font-rajdhani text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
                Зарегистрируйся, заполни профиль и начни торговать за 5 минут
              </p>
            </div>
            {!user ? (
              <button
                onClick={() => onOpenAuth("register")}
                className="cyber-btn cyber-btn-purple px-8 py-3 whitespace-nowrap"
              >
                НАЧАТЬ ТОРГОВАТЬ
              </button>
            ) : (
              <button
                onClick={() => onNavigate("profile")}
                className="cyber-btn cyber-btn-purple px-8 py-3 whitespace-nowrap"
              >
                МОЙ ПРОФИЛЬ →
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
