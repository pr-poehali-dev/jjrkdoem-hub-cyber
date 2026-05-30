import { useState } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "../components/ProductCard";
import { MOCK_PRODUCTS } from "../data/mockData";

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>(["1", "3"]);

  const favProducts = MOCK_PRODUCTS.filter((p) => favIds.includes(p.id));

  const handleRemove = (id: string) => {
    setFavIds((prev) => prev.filter((fid) => fid !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>// USER.FAVORITES</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-orbitron font-black text-2xl md:text-3xl" style={{ color: "var(--neon-cyan)" }}>
          ИЗБРАННОЕ
        </h1>
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>
          {favProducts.length} ЛОТОВ
        </span>
      </div>

      {favProducts.length === 0 ? (
        <div className="text-center py-32">
          <div className="animate-float inline-block mb-6">
            <Icon name="Heart" size={64} style={{ color: "rgba(255,0,100,0.15)" } as React.CSSProperties} />
          </div>
          <h2 className="font-orbitron text-base mb-2" style={{ color: "rgba(0,245,255,0.3)" }}>
            СПИСОК ПУСТ
          </h2>
          <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            Добавляй понравившиеся лоты в избранное через каталог
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFav={true}
              onFavorite={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
