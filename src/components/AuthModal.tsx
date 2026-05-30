import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "../types";
import { MOCK_USERS } from "../data/mockData";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onLogin: (user: User) => void;
  onSwitchMode: (mode: "login" | "register") => void;
}

const ADMIN_USERNAME = "ADMINISTRATOR CONSOLE";
const ADMIN_PASSWORD = "JJRKDOEMYT53";

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const storedUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem("hub_users") || "[]");
    } catch { return []; }
  };

  const saveUser = (u: User) => {
    const all = storedUsers();
    all.push(u);
    localStorage.setItem("hub_users", JSON.stringify(all));
  };

  const handleSubmit = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (mode === "login") {
        // Admin check
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          const adminUser: User = {
            username: "ADMINISTRATOR CONSOLE",
            password: ADMIN_PASSWORD,
            displayName: "ADMINISTRATOR",
            avatar: "",
            contact: "@admin",
            contactType: "tg",
            description: "Системный администратор",
            isAdmin: true,
            isBanned: false,
            joinedAt: new Date().toISOString().split("T")[0],
            verified: true,
          };
          onLogin(adminUser);
          return;
        }

        // Check mock + stored users
        const allUsers = [...MOCK_USERS, ...storedUsers()];
        const found = allUsers.find(
          (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (!found) {
          setError("Неверный никнейм или пароль");
          return;
        }
        if (found.isBanned) {
          setError("Этот аккаунт заблокирован");
          return;
        }
        onLogin(found);

      } else {
        // Register
        if (password !== confirmPassword) {
          setError("Пароли не совпадают");
          return;
        }
        if (password.length < 6) {
          setError("Пароль минимум 6 символов");
          return;
        }
        if (username.length < 3) {
          setError("Никнейм минимум 3 символа");
          return;
        }

        const allUsers = [...MOCK_USERS, ...storedUsers()];
        const exists = allUsers.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );
        if (exists) {
          setError("Этот никнейм уже занят");
          return;
        }

        const newUser: User = {
          username: username.trim(),
          password,
          displayName: username.trim(),
          avatar: "",
          contact: "",
          contactType: "tg",
          description: "",
          isAdmin: false,
          isBanned: false,
          joinedAt: new Date().toISOString().split("T")[0],
          verified: false,
        };
        saveUser(newUser);
        onLogin(newUser);
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md animate-scale-in corner-decorator"
        style={{
          background: "var(--dark-card)",
          border: "1px solid rgba(0,245,255,0.3)",
          boxShadow: "0 0 40px rgba(0,245,255,0.1), 0 0 80px rgba(191,0,255,0.05)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(0,245,255,0.15)" }}
        >
          <div>
            <div className="font-mono text-xs mb-1" style={{ color: "rgba(0,245,255,0.4)" }}>
              {mode === "login" ? "// AUTH.LOGIN" : "// AUTH.REGISTER"}
            </div>
            <h2 className="font-orbitron font-bold text-lg" style={{ color: "var(--neon-cyan)" }}>
              {mode === "login" ? "ВХОД В СИСТЕМУ" : "РЕГИСТРАЦИЯ"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "rgba(0,245,255,0.4)" }}>
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
              НИКНЕЙМ
            </label>
            <input
              className="cyber-input"
              placeholder="Введите никнейм..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
              ПАРОЛЬ
            </label>
            <input
              type="password"
              className="cyber-input"
              placeholder="Введите пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                ПОВТОРИТЕ ПАРОЛЬ
              </label>
              <input
                type="password"
                className="cyber-input"
                placeholder="Повторите пароль..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}

          {mode === "register" && (
            <div
              className="p-3 text-xs font-rajdhani"
              style={{
                background: "rgba(191,0,255,0.07)",
                border: "1px solid rgba(191,0,255,0.2)",
                color: "rgba(191,0,255,0.8)",
              }}
            >
              ⚠ Создать аккаунт можно только один раз. Повторная регистрация = бан.
            </div>
          )}

          {error && (
            <div
              className="p-3 text-xs font-rajdhani font-semibold"
              style={{
                background: "rgba(255,0,60,0.08)",
                border: "1px solid rgba(255,0,60,0.3)",
                color: "#ff3c3c",
              }}
            >
              ✗ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cyber-btn cyber-btn-filled w-full py-3 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="Loader2" size={16} />
                ОБРАБОТКА...
              </span>
            ) : mode === "login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
          </button>

          <div className="text-center">
            <button
              onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
              className="text-xs font-rajdhani transition-all"
              style={{ color: "rgba(0,245,255,0.5)" }}
            >
              {mode === "login" ? "Нет аккаунта? → РЕГИСТРАЦИЯ" : "Уже есть аккаунт? → ВОЙТИ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
