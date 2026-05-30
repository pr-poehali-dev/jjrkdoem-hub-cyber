import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "../types";

interface SupportPageProps {
  user: User | null;
}

const FAQ = [
  {
    q: "Как связаться с продавцом?",
    a: "После того как ты войдёшь в аккаунт, в карточке товара появится кнопка «Написать продавцу». Переписка идёт через встроенный чат в разделе Сообщения.",
  },
  {
    q: "Как начать продавать?",
    a: "Зарегистрируйся → заполни профиль → обязательно укажи контакт для связи → размести лот через каталог. Без контакта продавать нельзя.",
  },
  {
    q: "Можно ли создать два аккаунта?",
    a: "Нет. Создание второго аккаунта ведёт к бану обоих. Если забыл пароль — напиши в поддержку.",
  },
  {
    q: "Платформа гарантирует сделку?",
    a: "Нет, JJRKDOEM`HUB QQ — площадка для объявлений. Сделка происходит напрямую между пользователями. Мы не выступаем гарантом, но боремся с мошенниками через систему банов.",
  },
  {
    q: "Что делать если меня обманули?",
    a: "Напиши в поддержку с доказательствами (скриншоты переписки). Мы рассмотрим жалобу и заблокируем нарушителя при наличии доказательств.",
  },
];

export default function SupportPage({ user }: SupportPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState(user?.displayName || "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!name.trim() || !message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>// SYSTEM.SUPPORT</span>
      </div>
      <h1 className="font-orbitron font-black text-2xl md:text-3xl mb-10" style={{ color: "var(--neon-cyan)" }}>
        ПОДДЕРЖКА
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Icon name="HelpCircle" size={18} style={{ color: "var(--neon-purple)" }} />
            <h2 className="font-orbitron font-bold text-base" style={{ color: "var(--neon-purple)" }}>
              ЧАСТЫЕ ВОПРОСЫ
            </h2>
          </div>

          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="cyber-card overflow-hidden"
                style={{ borderColor: openFaq === i ? "rgba(191,0,255,0.4)" : "rgba(0,245,255,0.1)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-rajdhani font-semibold text-sm pr-3" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {item.q}
                  </span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={16}
                    style={{ color: "rgba(0,245,255,0.5)", flexShrink: 0 }}
                  />
                </button>
                {openFaq === i && (
                  <div
                    className="px-4 pb-4 animate-fade-in"
                    style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}
                  >
                    <p className="font-rajdhani text-sm pt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Icon name="Send" size={18} style={{ color: "var(--neon-cyan)" }} />
            <h2 className="font-orbitron font-bold text-base" style={{ color: "var(--neon-cyan)" }}>
              НАПИСАТЬ В ПОДДЕРЖКУ
            </h2>
          </div>

          <div className="cyber-card p-5 space-y-4">
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                НИКНЕЙМ / ИМЯ
              </label>
              <input
                className="cyber-input"
                placeholder="Ваш никнейм..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,245,255,0.5)" }}>
                СООБЩЕНИЕ
              </label>
              <textarea
                className="cyber-input resize-none"
                rows={5}
                placeholder="Опишите проблему подробно. Если жалуетесь на пользователя — прикрепите скриншоты в описание..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {sent ? (
              <div
                className="p-3 text-center font-rajdhani font-semibold text-sm animate-fade-in"
                style={{
                  background: "rgba(0,255,100,0.08)",
                  border: "1px solid rgba(0,255,100,0.25)",
                  color: "#00ff88",
                }}
              >
                ✓ Обращение отправлено. Ответим в ближайшее время.
              </div>
            ) : (
              <button
                onClick={handleSend}
                className="cyber-btn cyber-btn-filled w-full py-2.5"
                disabled={!name.trim() || !message.trim()}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Send" size={14} />
                  ОТПРАВИТЬ ОБРАЩЕНИЕ
                </span>
              </button>
            )}

            <div
              className="p-3 text-xs font-rajdhani"
              style={{
                background: "rgba(0,245,255,0.03)",
                border: "1px solid rgba(0,245,255,0.1)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Среднее время ответа: <span style={{ color: "var(--neon-cyan)" }}>до 24 часов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
