import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "../components/ProductCard";
import { Product, User } from "../types";

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

const STORAGE_KEY = "hub_products";

const loadProducts = (): Product[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "key" as Product["category"],
  game: "",
};

export default function CatalogPage({ user, onOpenAuth, onContact }: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"new" | "price_asc" | "price_desc" | "views">("new");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const isAdmin = user?.isAdmin === true;

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const filtered = products
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

  const handleAdd = () => {
    setFormError("");
    if (!form.title.trim()) { setFormError("Укажи название"); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setFormError("Укажи корректную цену"); return; }
    if (!form.game.trim()) { setFormError("Укажи игру"); return; }
    if (!form.description.trim()) { setFormError("Добавь описание"); return; }

    const newProduct: Product = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      game: form.game.trim(),
      seller: "ADMINISTRATOR CONSOLE",
      sellerVerified: true,
      image: "",
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) => [newProduct, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

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
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(0,245,255,0.4)" } as React.CSSProperties} />
          <input className="cyber-input pl-9" placeholder="Поиск по названию или игре..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="cyber-input w-auto min-w-[180px]" value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)} style={{ cursor: "pointer" }}>
          <option value="new">СНАЧАЛА НОВЫЕ</option>
          <option value="price_asc">ЦЕНА ↑</option>
          <option value="price_desc">ЦЕНА ↓</option>
          <option value="views">ПОПУЛЯРНЫЕ</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider transition-all duration-200"
            style={{
              background: category === cat.id ? "var(--neon-cyan)" : "transparent",
              border: `1px solid ${category === cat.id ? "var(--neon-cyan)" : "rgba(0,245,255,0.2)"}`,
              color: category === cat.id ? "#000" : "rgba(0,245,255,0.6)",
              fontWeight: category === cat.id ? "700" : "400",
            }}>
            <Icon name={cat.icon} size={12} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count + Admin button */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>
          НАЙДЕНО: <span style={{ color: "var(--neon-cyan)" }}>{filtered.length}</span> ЛОТОВ
        </span>
        {isAdmin && (
          <button
            className="cyber-btn cyber-btn-purple text-xs py-1.5 px-3"
            onClick={() => { setShowForm(!showForm); setFormError(""); }}
          >
            <span className="flex items-center gap-1.5">
              <Icon name={showForm ? "X" : "Plus"} size={12} />
              {showForm ? "ОТМЕНА" : "ДОБАВИТЬ ЛОТ"}
            </span>
          </button>
        )}
      </div>

      {/* Admin Add Form */}
      {isAdmin && showForm && (
        <div
          className="mb-8 p-5 animate-fade-in"
          style={{
            background: "rgba(191,0,255,0.04)",
            border: "1px solid rgba(191,0,255,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Plus" size={16} style={{ color: "var(--neon-purple)" }} />
            <h3 className="font-orbitron font-bold text-sm" style={{ color: "var(--neon-purple)" }}>
              НОВЫЙ ЛОТ
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(191,0,255,0.6)" }}>НАЗВАНИЕ *</label>
              <input className="cyber-input" placeholder="Название товара..."
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(191,0,255,0.6)" }}>ИГРА *</label>
              <input className="cyber-input" placeholder="CS2, Valorant, GTA..."
                value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(191,0,255,0.6)" }}>КАТЕГОРИЯ</label>
              <select className="cyber-input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}>
                <option value="key">Ключ</option>
                <option value="account">Аккаунт</option>
                <option value="item">Предмет</option>
                <option value="game">Игра</option>
                <option value="currency">Валюта</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(191,0,255,0.6)" }}>ЦЕНА (₽) *</label>
              <input className="cyber-input" placeholder="0" type="number" min="1"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(191,0,255,0.6)" }}>ОПИСАНИЕ *</label>
            <textarea className="cyber-input resize-none" rows={3}
              placeholder="Подробно опиши товар, условия продажи..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {formError && (
            <div className="mb-4 p-3 text-xs font-rajdhani font-semibold"
              style={{ background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.3)", color: "#ff3c3c" }}>
              ✗ {formError}
            </div>
          )}

          <button onClick={handleAdd} className="cyber-btn cyber-btn-filled px-6 py-2">
            <span className="flex items-center gap-2">
              <Icon name="Check" size={14} />
              ОПУБЛИКОВАТЬ ЛОТ
            </span>
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Icon name={isAdmin ? "PlusCircle" : "SearchX"} size={48} className="mx-auto mb-4"
            style={{ color: "rgba(0,245,255,0.2)" } as React.CSSProperties} />
          <p className="font-orbitron text-sm mb-2" style={{ color: "rgba(0,245,255,0.3)" }}>
            {isAdmin ? "ТОВАРОВ ЕЩЁ НЕТ" : "НИЧЕГО НЕ НАЙДЕНО"}
          </p>
          {isAdmin && (
            <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
              Нажми «Добавить лот» чтобы выложить первый товар
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard
                product={p}
                onContact={() => !user ? onOpenAuth("login") : onContact(p.seller, p.title)}
              />
              {isAdmin && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-8 p-1.5 transition-all z-10"
                  style={{
                    background: "rgba(255,0,60,0.15)",
                    border: "1px solid rgba(255,0,60,0.4)",
                    color: "#ff3c3c",
                  }}
                  title="Удалить лот"
                >
                  <Icon name="Trash2" size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
