import { useState } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "../components/ProductCard";
import { MOCK_PRODUCTS } from "../data/mockData";
import { User } from "../types";

type Category = "all" | "key" | "account" | "item" | "game" | "currency";

interface CatalogPageProps {
  user: User | null;
  onOpenAuth: (mode: "login" | "register") => void;
  onContact: (seller: string, product: string) => void;
}

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "all", label: "ВСЕ", icon: "LayoutGrid" },
  { id: "key", label: "КЛЮЧИ", icon: "Key" },
  { id: "account", label: "АККАУНТЫ", icon: "User" },
  { id: "item", label: "ПРЕДМЕТЫ", icon: "Sword" },
  { id: "game", label: "ИГРЫ", icon: "Gamepad2" },
  { id: "currency", label: "ВАЛЮТА", icon: "Coins" },
];

export default function CatalogPage({ user, onOpenAuth, onContact }: CatalogPageProps) {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"new" | "price_asc" | "price_desc" | "views">("new");

  const filtered = MOCK_PRODUCTS
    .filter((p) => category === "all" || p.category === category)
    .filter((p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.game.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "views") return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
          <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>// MARKETPLACE.CATALOG</span>
        </div>
        <h1 className="font-orbitron font-black text-2xl md:text-3xl" style={{ color: "var(--neon-cyan)" }}>
          КАТАЛОГ
        </h1>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(0,245,255,0.4)" } as React.CSSProperties}
          />
          <input
            className="cyber-input pl-9"
            placeholder="Поиск по названию или игре..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="cyber-input w-auto min-w-[180px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={{ cursor: "pointer" }}
        >
          <option value="new">СНАЧАЛА НОВЫЕ</option>
          <option value="price_asc">ЦЕНА ↑</option>
          <option value="price_desc">ЦЕНА ↓</option>
          <option value="views">ПОПУЛЯРНЫЕ</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider transition-all duration-200"
            style={{
              background: category === cat.id ? "var(--neon-cyan)" : "transparent",
              border: `1px solid ${category === cat.id ? "var(--neon-cyan)" : "rgba(0,245,255,0.2)"}`,
              color: category === cat.id ? "#000" : "rgba(0,245,255,0.6)",
              fontWeight: category === cat.id ? "700" : "400",
            }}
          >
            <Icon name={cat.icon} size={12} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>
          НАЙДЕНО: <span style={{ color: "var(--neon-cyan)" }}>{filtered.length}</span> ЛОТОВ
        </span>
        {user && (
          <button
            className="cyber-btn cyber-btn-purple text-xs py-1.5 px-3"
            onClick={() => {}}
          >
            <span className="flex items-center gap-1.5">
              <Icon name="Plus" size={12} />
              РАЗМЕСТИТЬ ЛОТ
            </span>
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Icon name="SearchX" size={48} className="mx-auto mb-4" style={{ color: "rgba(0,245,255,0.2)" } as React.CSSProperties} />
          <p className="font-orbitron text-sm" style={{ color: "rgba(0,245,255,0.3)" }}>
            НИЧЕГО НЕ НАЙДЕНО
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onContact={() => !user ? onOpenAuth("login") : onContact(p.seller, p.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}