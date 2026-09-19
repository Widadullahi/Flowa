import {
  MessageSquareText,
  AudioLines,
  ListChecks,
  CreditCard,
  Truck,
  BellRing,
  UserRoundCheck,
  AlarmClock,
  HandHelping,
  BarChart3,
  AlertCircle,
  Clock,
  PackageCheck,
  HelpCircle,
  Route,
  Upload,
  FileSpreadsheet,
  Check,
  Building2,
  Search,
  Bot,
  Eye,
  UserRound,
} from "lucide-react";
import { Card, Reveal, Section, SectionHeader } from "./primitives";

/* ---------- 6. FEATURES ---------- */
const features = [
  { icon: MessageSquareText, title: "AI Order Capture", body: "Turns natural WhatsApp messages into orders without forms." },
  { icon: AudioLines, title: "Voice & Image Understanding", body: "Understands voice notes and reference photos, not just text." },
  { icon: ListChecks, title: "Automatic Order Structuring", body: "Extracts items, options, quantities, dates and locations into clean records." },
  { icon: CreditCard, title: "Payment Collection", body: "Sends payment links via your provider and reconciles automatically." },
  { icon: Truck, title: "Delivery Coordination", body: "Location-based delivery pricing, dispatch and tracking updates." },
  { icon: BellRing, title: "Customer Notifications", body: "Proactive updates at each stage so customers never have to ask." },
  { icon: UserRoundCheck, title: "Owner Notifications", body: "Know what's due, what's stuck and what's new — as it happens." },
  { icon: AlarmClock, title: "Automated Reminders", body: "Payment nudges and pickup reminders, sent politely and on time." },
  { icon: HandHelping, title: "Human Handoff", body: "Escalates unusual requests to you and hands the chat back when done." },
  { icon: BarChart3, title: "Business Insights", body: "Orders, revenue and delivery performance, summarised on demand." },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeader
        eyebrow="Features"
        title="Everything between the chat and the customer's door."
        description="FLOWA is designed as an operations layer — each capability connects to the next."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} as="li" delay={(i % 5) * 50}>
              <Card className="h-full p-5">
                <div className="grid size-9 place-items-center rounded-xl bg-sage-soft text-sage">
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-4 text-[15px] font-medium tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- 7. FLOWA WATCHES ---------- */
const alerts = [
  { icon: AlertCircle, text: "3 customers haven't completed payment.", tone: "warning", time: "Now" },
  { icon: Clock, text: "Order #1042 is due for production today.", tone: "neutral", time: "8:00" },
  { icon: PackageCheck, text: "Order #1047 is ready but hasn't been assigned for delivery.", tone: "warning", time: "11:20" },
  { icon: HelpCircle, text: "FLOWA needs your help with a customer question.", tone: "sage", time: "12:05" },
  { icon: Route, text: "Order #1048 has been in transit longer than expected.", tone: "warning", time: "15:40" },
];

export function Watches() {
  return (
    <Section id="watch" className="border-t border-border">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-3 shadow-float sm:p-4">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-sm font-medium">Owner notifications</p>
                <span className="text-xs text-muted-foreground">Example</span>
              </div>
              <ul className="space-y-2">
                {alerts.map((a, i) => {
                  const Icon = a.icon;
                  const tone =
                    a.tone === "warning"
                      ? "bg-warning-soft text-warning"
                      : a.tone === "sage"
                        ? "bg-sage-soft text-sage"
                        : "bg-secondary text-foreground";
                  return (
                    <Reveal key={a.text} as="li" delay={i * 60}>
                      <div className="flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-3">
                        <span className={"mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg " + tone}>
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{a.text}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">FLOWA · {a.time}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow="Operational awareness"
            title="FLOWA watches the workflow so you don't have to."
            description="Every order has a state, a due date and a next step. FLOWA monitors all of them and tells you only what needs your attention — unpaid orders, production deadlines, unassigned deliveries and stuck shipments."
          />
        </div>
      </div>
    </Section>
  );
}

/* ---------- 8. BUSINESS CUSTOMIZATION ---------- */
const settings = [
  "Business name",
  "CAC / registration details",
  "Logo",
  "Business address",
  "Products",
  "Prices",
  "Catalogue",
  "Order requirements",
  "Delivery locations",
  "Delivery pricing",
  "Payment provider",
  "Business policies",
];

export function Customization() {
  return (
    <Section id="customize" dark>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader
            dark
            align="left"
            eyebrow="Built around your business"
            title="Configured to how you actually sell."
            description="FLOWA learns your catalogue, pricing, delivery zones and policies, so every order it creates follows your rules — not generic ones."
          />
          <Reveal delay={60}>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {settings.map((s) => (
                <li key={s} className="flex items-center gap-2 text-charcoal-foreground/90">
                  <Check className="size-3.5 shrink-0 text-sage" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="rounded-3xl border border-charcoal-border bg-charcoal-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-sage" aria-hidden />
              <p className="text-sm font-medium">Business setup · Catalogue</p>
            </div>
            <div className="mt-5 rounded-2xl border border-dashed border-charcoal-foreground/25 bg-charcoal p-8 text-center">
              <div className="mx-auto grid size-11 place-items-center rounded-xl bg-charcoal-card text-sage">
                <Upload className="size-5" aria-hidden />
              </div>
              <p className="mt-4 text-sm font-medium">Upload your catalogue</p>
              <p className="mt-1 text-xs text-charcoal-muted">CSV, spreadsheet, PDF price list or photos</p>
            </div>
            <ul className="mt-4 space-y-2">
              {[
                { name: "sweet-bloom-menu.xlsx", meta: "24 products · 6 categories", done: true },
                { name: "delivery-zones.csv", meta: "Lekki, Ikoyi, VI, Ajah, Yaba", done: true },
                { name: "policies.pdf", meta: "Processing…", done: false },
              ].map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-3 rounded-xl border border-charcoal-border px-3.5 py-2.5"
                >
                  <FileSpreadsheet className="size-4 text-charcoal-muted" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{f.name}</p>
                    <p className="text-xs text-charcoal-muted">{f.meta}</p>
                  </div>
                  {f.done ? (
                    <Check className="size-4 text-sage" aria-hidden />
                  ) : (
                    <span className="size-2 rounded-full bg-sage animate-pulse-soft" aria-hidden />
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-charcoal-muted">Example files shown for illustration.</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- 9. ASK FLOWA ---------- */
const prompts = [
  "Show me today's orders.",
  "Who hasn't paid?",
  "What orders are due tomorrow?",
  "Send payment reminders.",
  "Which deliveries are in transit?",
  "How much did I make this week?",
  "Which orders need my attention?",
];

export function AskFlowa() {
  return (
    <Section id="ask">
      <SectionHeader
        eyebrow="Ask FLOWA"
        title="Run your operations in plain language."
        description="No dashboards to learn. Ask FLOWA the way you'd ask a capable operations manager."
      />
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-card">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <p className="flex-1 text-sm text-muted-foreground">Ask FLOWA anything about your business…</p>
            <span className="hidden rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              ⏎
            </span>
          </div>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {prompts.map((p, i) => (
              <Reveal key={p} as="li" delay={i * 40}>
                <span className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-sage hover:text-sage">
                  "{p}"
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------- 10. HUMAN HANDOFF ---------- */
const states = [
  {
    icon: Bot,
    label: "AI handling",
    tone: "sage",
    example: "Confirming order #1051 — standard 8\" vanilla cake, Ikoyi, Friday.",
    body: "Routine orders, payments and updates are handled end to end.",
  },
  {
    icon: Eye,
    label: "Needs review",
    tone: "warning",
    example: "Customer asked for a 3-tier wedding cake in 24 hours. Can you do it?",
    body: "FLOWA pauses, summarises the context and asks you before committing.",
  },
  {
    icon: UserRound,
    label: "Human handling",
    tone: "neutral",
    example: "You're chatting with the customer. FLOWA will resume when you hand back.",
    body: "Take over any conversation in one tap. FLOWA keeps the order record updated.",
  },
];

export function Handoff() {
  return (
    <Section id="handoff" className="border-t border-border">
      <SectionHeader
        eyebrow="Human handoff"
        title="When FLOWA knows what to do, it handles it. When FLOWA needs help, it asks you."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {states.map((s, i) => {
          const Icon = s.icon;
          const tone =
            s.tone === "sage"
              ? "bg-sage text-primary-foreground"
              : s.tone === "warning"
                ? "bg-warning-soft text-warning"
                : "bg-foreground text-background";
          return (
            <Reveal key={s.label} delay={i * 80}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2.5">
                  <span className={"grid size-8 place-items-center rounded-full " + tone}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-medium">{s.label}</h3>
                </div>
                <div className="mt-5 rounded-xl bg-background px-4 py-3 text-sm leading-relaxed">
                  {s.example}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{s.body}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
