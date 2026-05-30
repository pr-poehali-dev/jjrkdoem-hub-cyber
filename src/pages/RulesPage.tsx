import Icon from "@/components/ui/icon";

const RULES = [
  {
    num: "01",
    title: "ОДИН АККАУНТ",
    icon: "User",
    color: "var(--neon-cyan)",
    text: "Создание нескольких аккаунтов запрещено. Обнаружение дублирующих аккаунтов ведёт к немедленной блокировке всех аккаунтов пользователя без предупреждения.",
  },
  {
    num: "02",
    title: "ОБЯЗАТЕЛЬНЫЙ КОНТАКТ",
    icon: "AtSign",
    color: "var(--neon-purple)",
    text: "Для продажи товаров необходимо указать контакт для связи в профиле (Telegram, ВКонтакте или другой). Без контакта продажа невозможна. Покупатель должен иметь возможность связаться с тобой.",
  },
  {
    num: "03",
    title: "ЧЕСТНЫЕ СДЕЛКИ",
    icon: "Handshake",
    color: "#00ff88",
    text: "Мошенничество, подделка скриншотов, продажа несуществующих товаров строго запрещены. За нарушение — бан без предупреждения. Мы не являемся гарантом сделки — действуй осторожно.",
  },
  {
    num: "04",
    title: "ОПЛАТА В ЧАТЕ",
    icon: "MessageSquare",
    color: "var(--neon-yellow)",
    text: "Все договорённости об оплате происходят напрямую между покупателем и продавцом через чат в профиле. Платформа не участвует в транзакциях и не несёт ответственности за исход сделки.",
  },
  {
    num: "05",
    title: "ЗАПРЕЩЁННЫЙ КОНТЕНТ",
    icon: "Ban",
    color: "#ff3c3c",
    text: "Запрещено продавать: ворованные аккаунты, читы и боты, аккаунты с банами, товары без реального наличия. Нарушение ведёт к блокировке.",
  },
  {
    num: "06",
    title: "УВАЖЕНИЕ",
    icon: "Shield",
    color: "#ff9500",
    text: "Запрещены оскорбления, спам, реклама сторонних ресурсов. Общайся вежливо. Нарушения в чатах могут привести к блокировке аккаунта.",
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>// SYSTEM.RULES</span>
      </div>
      <h1 className="font-orbitron font-black text-2xl md:text-3xl mb-2" style={{ color: "var(--neon-cyan)" }}>
        ПРАВИЛА ПЛАТФОРМЫ
      </h1>
      <p className="font-rajdhani text-base mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
        Обязательны для всех пользователей. Незнание правил не освобождает от ответственности.
      </p>

      <div className="space-y-4">
        {RULES.map((rule) => (
          <div key={rule.num} className="cyber-card p-5 flex gap-5 hover-scale">
            <div className="flex-shrink-0">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{
                  border: `1px solid ${rule.color}`,
                  background: `${rule.color}10`,
                  color: rule.color,
                }}
              >
                <Icon name={rule.icon} size={20} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="font-mono text-xs"
                  style={{ color: `${rule.color}60` }}
                >
                  [{rule.num}]
                </span>
                <h3
                  className="font-orbitron font-bold text-sm"
                  style={{ color: rule.color }}
                >
                  {rule.title}
                </h3>
              </div>
              <p className="font-rajdhani text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {rule.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="mt-8 p-5"
        style={{
          background: "rgba(0,245,255,0.03)",
          border: "1px solid rgba(0,245,255,0.15)",
        }}
      >
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} style={{ color: "rgba(0,245,255,0.5)", flexShrink: 0, marginTop: "2px" }} />
          <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Администрация оставляет за собой право изменять правила без предупреждения.
            По всем вопросам — раздел <span style={{ color: "var(--neon-cyan)" }}>Поддержка</span>.
            Нарушители блокируются администратором JJRKDOEM`HUB QQ.
          </p>
        </div>
      </div>
    </div>
  );
}
