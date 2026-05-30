import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "../types";
import { MOCK_USERS } from "../data/mockData";

interface ProfilePageProps {
  user: User;
  setUser: (u: User) => void;
}

export default function ProfilePage({ user, setUser }: ProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [contact, setContact] = useState(user.contact);
  const [contactType, setContactType] = useState(user.contactType);
  const [description, setDescription] = useState(user.description);
  const [saved, setSaved] = useState(false);

  // Admin panel state
  const [adminTab, setAdminTab] = useState<"users" | "ban">("users");
  const [banTarget, setBanTarget] = useState("");
  const [banReason, setBanReason] = useState("");

  const allUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("hub_users") || "[]") as User[];
    } catch { return []; }
  };

  const handleSave = () => {
    if (!contact.trim() && !description.trim()) return;
    const updated = { ...user, displayName, contact, contactType, description };
    setUser(updated);

    // Update in storage
    const users = allUsers();
    const idx = users.findIndex((u) => u.username === user.username);
    if (idx !== -1) {
      users[idx] = updated;
      localStorage.setItem("hub_users", JSON.stringify(users));
    }

    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBan = (username: string) => {
    const users = allUsers();
    const idx = users.findIndex((u) => u.username === username);
    if (idx !== -1) {
      users[idx].isBanned = true;
      localStorage.setItem("hub_users", JSON.stringify(users));
    }
    setBanTarget("");
    setBanReason("");
  };

  const handleDelete = (username: string) => {
    const users = allUsers().filter((u) => u.username !== username);
    localStorage.setItem("hub_users", JSON.stringify(users));
  };

  const hasContact = user.contact && user.contact.trim() !== "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>// USER.PROFILE</span>
      </div>

      {/* Profile Card */}
      <div className="cyber-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="w-24 h-24 flex items-center justify-center font-orbitron font-black text-3xl relative"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "2px solid var(--neon-cyan)",
                boxShadow: "0 0 20px rgba(0,245,255,0.2)",
                color: "var(--neon-cyan)",
              }}
            >
              {user.displayName[0].toUpperCase()}
              {user.verified && (
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center"
                  style={{ background: "var(--neon-cyan)" }}
                >
                  <Icon name="Check" size={12} style={{ color: "#000" }} />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-orbitron font-bold text-xl mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {user.displayName}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>
                    @{user.username}
                  </span>
                  {user.isAdmin && (
                    <span
                      className="tag-badge"
                      style={{ color: "var(--neon-yellow)", borderColor: "var(--neon-yellow)" }}
                    >
                      ADMIN
                    </span>
                  )}
                  {user.verified && (
                    <span
                      className="tag-badge"
                      style={{ color: "var(--neon-cyan)", borderColor: "var(--neon-cyan)" }}
                    >
                      VERIFIED
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="cyber-btn text-xs py-1.5 px-3"
              >
                <span className="flex items-center gap-1.5">
                  <Icon name={editing ? "X" : "Edit2"} size={12} />
                  {editing ? "ОТМЕНА" : "РЕДАКТИРОВАТЬ"}
                </span>
              </button>
            </div>

            <div className="font-mono text-xs mb-3" style={{ color: "rgba(0,245,255,0.3)" }}>
              На платформе с {user.joinedAt}
            </div>

            {!hasContact && !editing && (
              <div
                className="p-3 mb-3"
                style={{
                  background: "rgba(255,150,0,0.08)",
                  border: "1px solid rgba(255,150,0,0.3)",
                  color: "#ff9500",
                }}
              >
                <div className="flex items-center gap-2 text-xs font-rajdhani font-semibold">
                  <Icon name="AlertTriangle" size={14} />
                  Укажи контакт для связи — без него нельзя продавать!
                </div>
              </div>
            )}

            {user.description && !editing && (
              <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {user.description}
              </p>
            )}

            {user.contact && !editing && (
              <div className="flex items-center gap-2 mt-2">
                <Icon name="AtSign" size={14} style={{ color: "rgba(0,245,255,0.5)" }} />
                <span className="font-mono text-sm" style={{ color: "var(--neon-cyan)" }}>
                  {user.contact}
                </span>
                <span className="tag-badge" style={{ color: "rgba(0,245,255,0.5)", borderColor: "rgba(0,245,255,0.2)", fontSize: "10px" }}>
                  {contactType === "tg" ? "TELEGRAM" : contactType === "vk" ? "VK" : "OTHER"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div
            className="mt-6 pt-6 space-y-4 animate-fade-in"
            style={{ borderTop: "1px solid rgba(0,245,255,0.15)" }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                  ОТОБРАЖАЕМОЕ ИМЯ
                </label>
                <input
                  className="cyber-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Имя в системе"
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                  ТИП КОНТАКТА
                </label>
                <select
                  className="cyber-input"
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value as "tg" | "vk" | "other")}
                >
                  <option value="tg">Telegram</option>
                  <option value="vk">ВКонтакте</option>
                  <option value="other">Другое</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                КОНТАКТ ДЛЯ СВЯЗИ *
              </label>
              <input
                className="cyber-input"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={contactType === "tg" ? "@username" : contactType === "vk" ? "vk.com/id..." : "Ссылка или контакт"}
              />
              <div className="mt-1 text-xs font-rajdhani" style={{ color: "rgba(255,150,0,0.6)" }}>
                ⚠ Обязательно — без контакта продавать нельзя
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                ОПИСАНИЕ / О СЕБЕ
              </label>
              <textarea
                className="cyber-input resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажи о себе и условиях сделок..."
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} className="cyber-btn cyber-btn-filled px-6 py-2">
                СОХРАНИТЬ
              </button>
              <button onClick={() => setEditing(false)} className="cyber-btn px-6 py-2">
                ОТМЕНА
              </button>
            </div>
          </div>
        )}

        {saved && (
          <div
            className="mt-4 p-3 text-xs font-rajdhani font-semibold animate-fade-in"
            style={{ background: "rgba(0,255,100,0.08)", border: "1px solid rgba(0,255,100,0.25)", color: "#00ff88" }}
          >
            ✓ Профиль обновлён
          </div>
        )}
      </div>

      {/* ADMIN PANEL */}
      {user.isAdmin && (
        <div
          className="cyber-card p-6"
          style={{ borderColor: "rgba(255,230,0,0.3)", boxShadow: "0 0 20px rgba(255,230,0,0.05)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Shield" size={20} style={{ color: "var(--neon-yellow)" }} />
            <h3 className="font-orbitron font-bold text-lg" style={{ color: "var(--neon-yellow)" }}>
              ADMIN PANEL
            </h3>
            <div
              className="tag-badge"
              style={{ color: "var(--neon-yellow)", borderColor: "var(--neon-yellow)" }}
            >
              SYSTEM ACCESS
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "users" as const, label: "ПОЛЬЗОВАТЕЛИ", icon: "Users" },
              { id: "ban" as const, label: "БЛОКИРОВКА", icon: "Ban" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setAdminTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono transition-all"
                style={{
                  background: adminTab === t.id ? "var(--neon-yellow)" : "transparent",
                  border: `1px solid ${adminTab === t.id ? "var(--neon-yellow)" : "rgba(255,230,0,0.2)"}`,
                  color: adminTab === t.id ? "#000" : "rgba(255,230,0,0.6)",
                  fontWeight: adminTab === t.id ? "700" : "400",
                }}
              >
                <Icon name={t.icon} size={12} />
                {t.label}
              </button>
            ))}
          </div>

          {adminTab === "users" && (
            <div>
              <div className="font-mono text-xs mb-4" style={{ color: "rgba(255,230,0,0.4)" }}>
                ЗАРЕГИСТРИРОВАННЫЕ ПОЛЬЗОВАТЕЛИ
              </div>
              {allUsers().length === 0 ? (
                <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Нет зарегистрированных пользователей
                </p>
              ) : (
                <div className="space-y-2">
                  {allUsers().map((u) => (
                    <div
                      key={u.username}
                      className="flex items-center justify-between p-3"
                      style={{ background: "rgba(255,230,0,0.03)", border: "1px solid rgba(255,230,0,0.1)" }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-rajdhani font-semibold text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                            {u.displayName}
                          </span>
                          {u.isBanned && (
                            <span className="tag-badge" style={{ color: "#ff3c3c", borderColor: "#ff3c3c", fontSize: "10px" }}>
                              BANNED
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          @{u.username} · {u.joinedAt}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!u.isBanned && (
                          <button
                            onClick={() => handleBan(u.username)}
                            className="p-1.5 transition-all"
                            style={{ color: "#ff3c3c", border: "1px solid rgba(255,60,60,0.3)" }}
                            title="Заблокировать"
                          >
                            <Icon name="Ban" size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u.username)}
                          className="p-1.5 transition-all"
                          style={{ color: "rgba(255,60,60,0.5)", border: "1px solid rgba(255,60,60,0.2)" }}
                          title="Удалить аккаунт"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "ban" && (
            <div className="space-y-4">
              <div className="font-mono text-xs mb-2" style={{ color: "rgba(255,230,0,0.4)" }}>
                РУЧНАЯ БЛОКИРОВКА ПОЛЬЗОВАТЕЛЯ
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(255,230,0,0.5)" }}>
                  НИКНЕЙМ
                </label>
                <input
                  className="cyber-input"
                  style={{ borderColor: "rgba(255,230,0,0.25)", color: "var(--neon-yellow)" }}
                  placeholder="Введите никнейм..."
                  value={banTarget}
                  onChange={(e) => setBanTarget(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(255,230,0,0.5)" }}>
                  ПРИЧИНА БЛОКИРОВКИ
                </label>
                <textarea
                  className="cyber-input resize-none"
                  style={{ borderColor: "rgba(255,230,0,0.25)", color: "var(--neon-yellow)" }}
                  rows={2}
                  placeholder="Причина..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => banTarget && handleBan(banTarget)}
                  className="cyber-btn text-xs px-4 py-2"
                  style={{ borderColor: "#ff3c3c", color: "#ff3c3c" }}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name="Ban" size={12} />
                    ЗАБЛОКИРОВАТЬ
                  </span>
                </button>
                <button
                  onClick={() => banTarget && handleDelete(banTarget)}
                  className="cyber-btn text-xs px-4 py-2"
                  style={{ borderColor: "rgba(255,60,60,0.4)", color: "rgba(255,60,60,0.7)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon name="Trash2" size={12} />
                    УДАЛИТЬ АККАУНТ
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
