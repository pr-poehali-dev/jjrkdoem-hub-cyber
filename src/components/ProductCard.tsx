import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onContact?: () => void;
  onFavorite?: (id: string) => void;
  isFav?: boolean;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  key:      { label: "КЛЮЧ", color: "var(--neon-cyan)" },
  account:  { label: "АККАУНТ", color: "var(--neon-purple)" },
  item:     { label: "ПРЕДМЕТ", color: "#ff9500" },
  game:     { label: "ИГРА", color: "#00ff88" },
  currency: { label: "ВАЛЮТА", color: "var(--neon-yellow)" },
};

export default function ProductCard({ product, onContact, onFavorite, isFav }: ProductCardProps) {
  const [fav, setFav] = useState(isFav || false);
  const cat = CATEGORY_LABELS[product.category];

  const handleFav = () => {
    setFav(!fav);
    onFavorite?.(product.id);
  };

  return (
    <div className="cyber-card group animate-fade-in" style={{ borderRadius: "2px" }}>
      {/* Image area */}
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,245,255,0.04) 0%, rgba(191,0,255,0.04) 100%)",
          borderBottom: "1px solid rgba(0,245,255,0.1)",
        }}
      >
        <div
          className="w-16 h-16 flex items-center justify-center"
          style={{
            border: "1px solid rgba(0,245,255,0.2)",
            background: "rgba(0,245,255,0.05)",
          }}
        >
          <Icon name={
            product.category === "key" ? "Key" :
            product.category === "account" ? "User" :
            product.category === "item" ? "Sword" :
            product.category === "game" ? "Gamepad2" : "Coins"
          } size={28} />
        </div>

        {/* Category badge */}
        <div
          className="absolute top-2 left-2 tag-badge"
          style={{ color: cat.color, borderColor: cat.color, background: "rgba(0,0,0,0.7)" }}
        >
          {cat.label}
        </div>

        {/* Fav button */}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 p-1 transition-all"
          style={{ color: fav ? "#ff004d" : "rgba(255,255,255,0.3)" }}
        >
          <Icon name="Heart" size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.35)" }}>
          {product.game}
        </div>
        <h3
          className="font-rajdhani font-semibold text-sm leading-tight line-clamp-2"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {product.title}
        </h3>

        {/* Seller */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 flex items-center justify-center text-xs font-orbitron font-bold"
            style={{ background: "rgba(0,245,255,0.15)", color: "var(--neon-cyan)", fontSize: "9px" }}
          >
            {product.seller[0]}
          </div>
          <span className="text-xs font-rajdhani" style={{ color: "rgba(0,245,255,0.6)" }}>
            {product.seller}
          </span>
          {product.sellerVerified && (
            <Icon name="BadgeCheck" size={12} style={{ color: "var(--neon-cyan)" }} />
          )}
        </div>

        {/* Price + Views */}
        <div className="flex items-center justify-between pt-1">
          <span
            className="font-orbitron font-bold text-base"
            style={{ color: "var(--neon-cyan)" }}
          >
            {product.price.toLocaleString()} ₽
          </span>
          <div className="flex items-center gap-1" style={{ color: "rgba(0,245,255,0.3)" }}>
            <Icon name="Eye" size={12} />
            <span className="text-xs font-mono">{product.views}</span>
          </div>
        </div>

        <button
          onClick={onContact}
          className="cyber-btn w-full py-2 text-xs mt-1"
        >
          <span className="flex items-center justify-center gap-1.5">
            <Icon name="MessageSquare" size={12} />
            НАПИСАТЬ ПРОДАВЦУ
          </span>
        </button>
      </div>
    </div>
  );
}
