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
  key:      { label: "КЛЮЧ",    color: "var(--neon-cyan)" },
  account:  { label: "АККАУНТ", color: "var(--neon-purple)" },
  item:     { label: "ПРЕДМЕТ", color: "#ff9500" },
  game:     { label: "ИГРА",    color: "#00ff88" },
  currency: { label: "ВАЛЮТА",  color: "var(--neon-yellow)" },
};

const CAT_ICONS: Record<string, string> = {
  key: "Key", account: "User", item: "Sword", game: "Gamepad2", currency: "Coins",
};

function getYoutubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function ProductCard({ product, onContact, onFavorite, isFav }: ProductCardProps) {
  const [fav, setFav] = useState(isFav || false);
  const [imgIdx, setImgIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cat = CATEGORY_LABELS[product.category];
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const videoId = getYoutubeId(product.videoUrl || "");
  const hasMedia = images.length > 0 || videoId;

  const handleFav = () => {
    setFav(!fav);
    onFavorite?.(product.id);
  };

  return (
    <div className="cyber-card group animate-fade-in flex flex-col" style={{ borderRadius: "2px" }}>

      {/* ── MEDIA AREA ── */}
      <div className="relative overflow-hidden"
        style={{
          height: hasMedia ? "180px" : "120px",
          background: "linear-gradient(135deg, rgba(0,245,255,0.04) 0%, rgba(191,0,255,0.04) 100%)",
          borderBottom: "1px solid rgba(0,245,255,0.1)",
        }}>

        {/* Image */}
        {images.length > 0 && !showVideo && (
          <img
            src={images[imgIdx]}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
        )}

        {/* YouTube embed */}
        {videoId && showVideo && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: "none" }}
          />
        )}

        {/* No media placeholder */}
        {!hasMedia && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 flex items-center justify-center"
              style={{ border: "1px solid rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.05)" }}>
              <Icon name={CAT_ICONS[product.category]} size={26} style={{ color: "rgba(0,245,255,0.4)" }} />
            </div>
          </div>
        )}

        {/* Image navigation arrows */}
        {images.length > 1 && !showVideo && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,245,255,0.3)" }}>
              <Icon name="ChevronLeft" size={14} style={{ color: "var(--neon-cyan)" }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,245,255,0.3)" }}>
              <Icon name="ChevronRight" size={14} style={{ color: "var(--neon-cyan)" }} />
            </button>
            {/* Dots */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === imgIdx ? "var(--neon-cyan)" : "rgba(255,255,255,0.3)" }} />
              ))}
            </div>
          </>
        )}

        {/* Video toggle button */}
        {videoId && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 text-xs font-mono transition-all"
            style={{
              background: showVideo ? "rgba(255,0,0,0.7)" : "rgba(0,0,0,0.75)",
              border: `1px solid ${showVideo ? "rgba(255,0,0,0.8)" : "rgba(255,255,255,0.2)"}`,
              color: "#fff",
            }}>
            <Icon name={showVideo ? "X" : "Play"} size={11} />
            {showVideo ? "ФОТО" : "ВИДЕО"}
          </button>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2 tag-badge"
          style={{ color: cat.color, borderColor: cat.color, background: "rgba(0,0,0,0.75)" }}>
          {cat.label}
        </div>

        {/* Fav button */}
        <button onClick={handleFav}
          className="absolute top-2 right-2 p-1 transition-all"
          style={{ color: fav ? "#ff004d" : "rgba(255,255,255,0.35)" }}>
          <Icon name="Heart" size={15} />
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-3 flex flex-col flex-1 space-y-2">
        <div className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.35)" }}>{product.game}</div>

        <h3 className="font-rajdhani font-semibold text-sm leading-tight line-clamp-2"
          style={{ color: "rgba(255,255,255,0.9)" }}>
          {product.title}
        </h3>

        {/* Description expandable */}
        {product.description && (
          <div>
            <p className={`font-rajdhani text-xs leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
              style={{ color: "rgba(255,255,255,0.45)" }}>
              {product.description}
            </p>
            {product.description.length > 80 && (
              <button onClick={() => setExpanded(!expanded)}
                className="font-mono text-xs mt-0.5 transition-all"
                style={{ color: "rgba(0,245,255,0.4)" }}>
                {expanded ? "▲ скрыть" : "▼ читать"}
              </button>
            )}
          </div>
        )}

        {/* Seller */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 flex items-center justify-center font-orbitron font-bold"
            style={{ background: "rgba(0,245,255,0.15)", color: "var(--neon-cyan)", fontSize: "9px" }}>
            {product.seller[0]}
          </div>
          <span className="text-xs font-rajdhani" style={{ color: "rgba(0,245,255,0.6)" }}>{product.seller}</span>
          {product.sellerVerified && <Icon name="BadgeCheck" size={12} style={{ color: "var(--neon-cyan)" }} />}
        </div>

        {/* Price + Views */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-orbitron font-bold text-base" style={{ color: "var(--neon-cyan)" }}>
            {product.price.toLocaleString()} ₽
          </span>
          <div className="flex items-center gap-1" style={{ color: "rgba(0,245,255,0.3)" }}>
            <Icon name="Eye" size={12} />
            <span className="text-xs font-mono">{product.views}</span>
          </div>
        </div>

        <button onClick={onContact} className="cyber-btn w-full py-2 text-xs mt-auto">
          <span className="flex items-center justify-center gap-1.5">
            <Icon name="MessageSquare" size={12} />
            НАПИСАТЬ ПРОДАВЦУ
          </span>
        </button>
      </div>
    </div>
  );
}
