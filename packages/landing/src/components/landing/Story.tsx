import {
  MessageSquareText,
  Table2,
  Wallet,
  Factory,
  Truck,
  ArrowRight,
  Brain,
  ClipboardList,
  CreditCard,
  Package,
  CheckCircle2,
  MessageCircle,
  Bell,
} from "lucide-react";
import { Card, Reveal, Section, SectionHeader } from "./primitives";

/* ---------- 2. PROBLEM ---------- */
const tools = [
  { icon: MessageSquareText, label: "WhatsApp" },
  { icon: Table2, label: "Spreadsheets" },
  { icon: Wallet, label: "Payment apps" },
  { icon: Factory, label: "Production" },
  { icon: Truck, label: "Logistics" },
];

export function Problem() {
  return (
    <Section id="problem" className="border-t border-border">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader
            align="left"
            eyebrow="The problem"
            title="Your business already runs on conversations."
            description="For many businesses, WhatsApp is the storefront. Orders arrive as chats, voice notes and screenshots. Then someone manually copies details into a spreadsheet, chases the payment, briefs production, and arranges the rider — retyping the same information at every step."
          />
          <Reveal delay={80}>
            <blockquote className="border-l-2 border-sage pl-5">
              <p className="text-xl font-medium tracking-tight text-balance sm:text-2xl">
                The problem isn't a lack of tools. It's disconnected tools.
              </p>
            </blockquote>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
            <p className="eyebrow mb-6 text-muted-foreground">Today: information moved by hand</p>
            <ul className="space-y-3">
              {tools.map((t, i) => {
                const Icon = t.icon;
                return (
                  <li key={t.label} className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                      <Icon className="size-4 text-muted-foreground" aria-hidden />
                      <span className="text-sm font-medium">{t.label}</span>
                    </div>
                    {i < tools.length - 1 ? (
                      <span className="hidden text-xs text-muted-foreground sm:inline-flex sm:w-20 sm:items-center sm:gap-1">
                        <span className="h-px flex-1 border-t border-dashed border-border" />
                        retype
                      </span>
                    ) : (
                      <span className="hidden sm:block sm:w-20" />
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Every arrow is a person copying details between tools that don't talk to each other.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- 3. MEET FLOWA ---------- */
const chain = [
  { icon: MessageCircle, label: "Conversation" },
  { icon: Brain, label: "Understanding" },
  { icon: ClipboardList, label: "Order" },
  { icon: CreditCard, label: "Payment" },
  { icon: Package, label: "Fulfillment" },
  { icon: Truck, label: "Delivery" },
  { icon: CheckCircle2, label: "Completion" },
];

export function MeetFlowa() {
  return (
    <Section id="meet" dark>
      <SectionHeader
        dark
        eyebrow="Introducing FLOWA"
        title="Meet FLOWA."
        description="The AI operations assistant built for businesses that sell through messaging. FLOWA sits between customer conversations and business infrastructure — not another chatbot, an orchestration layer that carries every order through to completion."
      />
      <Reveal>
        <ol className="flex flex-wrap items-center justify-center gap-y-4" aria-label="FLOWA order journey">
          {chain.map((c, i) => {
            const Icon = c.icon;
            return (
              <li key={c.label} className="flex items-center">
                <div className="flex items-center gap-2.5 rounded-full border border-charcoal-border bg-charcoal-card px-4 py-2.5">
                  <Icon className="size-4 text-sage" aria-hidden />
                  <span className="text-sm font-medium">{c.label}</span>
                </div>
                {i < chain.length - 1 && (
                  <ArrowRight className="mx-2 size-4 shrink-0 text-charcoal-muted" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Reads the conversation",
            body: "Text, voice notes and images become structured order details.",
          },
          {
            title: "Coordinates the operation",
            body: "Payment, production, delivery and notifications move in sequence — without manual handoffs.",
          },
          {
            title: "Keeps you in control",
            body: "Watches every order, alerts you to what needs attention, and hands over when it's unsure.",
          },
        ].map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <div className="h-full rounded-2xl border border-charcoal-border bg-charcoal-card/60 p-6">
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 4. HOW IT WORKS ---------- */
const steps = [
  { n: "01", icon: MessageCircle, title: "Customer chats normally", body: "A message, voice note or photo on WhatsApp — the way they already order today." },
  { n: "02", icon: Brain, title: "FLOWA understands", body: "Identifies the product, quantity, customisation, location and timing from natural language." },
  { n: "03", icon: ClipboardList, title: "FLOWA creates the order", body: "Generates a structured order, asks for anything missing, and confirms it with the customer." },
  { n: "04", icon: CreditCard, title: "FLOWA handles payment", body: "Shares a payment link through your provider and marks the order paid on confirmation." },
  { n: "05", icon: Package, title: "FLOWA coordinates fulfillment", body: "Puts the order on your production schedule with its due date and requirements." },
  { n: "06", icon: Truck, title: "FLOWA handles delivery", body: "Calculates delivery pricing by location and coordinates dispatch and tracking." },
  { n: "07", icon: Bell, title: "FLOWA sends notifications", body: "Keeps the customer and you updated at every stage — no 'any update?' messages." },
  { n: "08", icon: CheckCircle2, title: "FLOWA completes the order", body: "Confirms delivery, closes the order, and records it in your business insights." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        eyebrow="How it works"
        title="One conversation. Eight steps handled."
        description="From the first message to the final confirmation, FLOWA carries each order through the full operational journey."
      />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.n} as="li" delay={(i % 4) * 60}>
              <Card className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.14em] text-sage">{s.n}</span>
                  <div className="grid size-9 place-items-center rounded-xl bg-secondary text-foreground">
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                  </div>
                </div>
                <h3 className="mt-5 font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Card>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
