import {
  CakeSlice,
  Scissors,
  Gift,
  Flower2,
  Printer,
  Gem,
  UtensilsCrossed,
  Boxes,
  Smartphone,
  KeyRound,
  Layers,
  ShieldCheck,
  Split,
  HandHelping,
} from "lucide-react";
import { Card, Reveal, Section, SectionHeader, TryFlowaButton } from "./primitives";
import { Logo } from "./Nav";
import { WHATSAPP_URL } from "@/lib/site-config";

/* ---------- 11. BUSINESS TYPES ---------- */
const types = [
  { icon: CakeSlice, label: "Bakers" },
  { icon: Scissors, label: "Fashion & Tailoring" },
  { icon: Gift, label: "Gift Businesses" },
  { icon: Flower2, label: "Florists" },
  { icon: Printer, label: "Custom Printers" },
  { icon: Gem, label: "Jewellery" },
  { icon: UtensilsCrossed, label: "Food & Catering" },
  { icon: Boxes, label: "Other Custom Businesses" },
];

export function BusinessTypes() {
  return (
    <Section id="businesses">
      <SectionHeader
        eyebrow="Who it's for"
        title="Built for businesses that make things to order."
        description="If your customers describe what they want in a chat, FLOWA is built for you."
      />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {types.map((t, i) => {
          const Icon = t.icon;
          return (
            <Reveal key={t.label} as="li" delay={(i % 4) * 50}>
              <Card className="flex h-full flex-col items-start gap-4 p-5 sm:p-6">
                <div className="grid size-10 place-items-center rounded-xl bg-secondary">
                  <Icon className="size-5" strokeWidth={1.6} aria-hidden />
                </div>
                <h3 className="text-[15px] font-medium tracking-tight">{t.label}</h3>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- 12. NO NEW WORKFLOW ---------- */
export function NoNewWorkflow() {
  return (
    <Section id="no-new-workflow" className="border-t border-border">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Zero friction for customers"
            title="They don't need to learn FLOWA."
            description="Customers continue using WhatsApp normally. No new app to download, no complicated forms to fill, no account to create. FLOWA works inside the conversation they already started."
          />
          <Reveal delay={60}>
            <ul className="grid gap-3 sm:grid-cols-3">
              {["No new app", "No forms", "No new habits"].map((t) => (
                <li key={t} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={120} className="justify-self-center">
          <div className="relative w-[240px] rounded-[2.2rem] border border-border bg-foreground p-2 shadow-float">
            <div className="rounded-[1.8rem] bg-whatsapp-bg p-3 pt-8">
              <div className="mx-auto mb-4 h-1 w-14 rounded-full bg-border" aria-hidden />
              <div className="space-y-2">
                <div className="ml-auto w-[80%] rounded-2xl rounded-br-md bg-whatsapp-bubble px-3 py-2 text-[11px]">
                  Hi! Do you have the linen set in size 12?
                </div>
                <div className="w-[85%] rounded-2xl rounded-bl-md bg-card px-3 py-2 text-[11px]">
                  Yes — in oat and navy. Which colour would you like, and where should we deliver?
                </div>
                <div className="ml-auto w-[60%] rounded-2xl rounded-br-md bg-whatsapp-bubble px-3 py-2 text-[11px]">
                  Oat. Yaba please
                </div>
                <div className="w-[85%] rounded-2xl rounded-bl-md bg-card px-3 py-2 text-[11px]">
                  Order #2210 ready to confirm: ₦32,000 + ₦1,500 delivery. Payment link below.
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-full bg-card px-3 py-2 text-[10px] text-muted-foreground">
                <Smartphone className="size-3" aria-hidden /> Just WhatsApp
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- 13. GET STARTED ---------- */
const starts = [
  { n: "01", title: "Try FLOWA", body: "Start a chat with FLOWA on WhatsApp." },
  { n: "02", title: "Tell us about your business", body: "Name, registration details, address and logo." },
  { n: "03", title: "Upload your catalogue", body: "Products, prices and order requirements." },
  { n: "04", title: "Set up payments", body: "Connect your preferred payment provider." },
  { n: "05", title: "Set up delivery", body: "Delivery locations and pricing." },
  { n: "06", title: "Connect WhatsApp Business", body: "Link your business number." },
  { n: "07", title: "You're ready", body: "FLOWA starts handling orders." },
];

export function GetStarted() {
  return (
    <Section id="get-started">
      <SectionHeader
        eyebrow="Getting started"
        title="Set up in a conversation, not a configuration."
        description="Onboarding happens the same way your customers order — by chatting."
      />
      <ol className="relative mx-auto max-w-3xl">
        <span className="absolute top-3 bottom-3 left-[19px] w-px bg-border" aria-hidden />
        {starts.map((s, i) => (
          <Reveal key={s.n} as="li" delay={i * 40} className="relative flex gap-5 pb-8 last:pb-0">
            <span
              className={
                "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border text-xs font-semibold " +
                (i === starts.length - 1
                  ? "border-sage bg-sage text-primary-foreground"
                  : "border-border bg-card text-foreground")
              }
            >
              {s.n}
            </span>
            <div className="pt-2">
              <h3 className="font-medium tracking-tight">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ---------- 14. SECURITY ---------- */
const security = [
  { icon: KeyRound, title: "Secure authentication", body: "Business owners sign in with protected, verified sessions." },
  { icon: Layers, title: "Business data isolation", body: "Each business's orders, customers and catalogue are kept separate." },
  { icon: ShieldCheck, title: "Verified external-service webhooks", body: "Payment and delivery callbacks are signature-verified before anything is updated." },
  { icon: Split, title: "AI / backend separation", body: "The AI interprets conversations; it never has direct, unchecked access to your records." },
  { icon: HandHelping, title: "Human takeover", body: "You can step into any conversation and override any decision at any time." },
];

export function Security() {
  return (
    <Section id="security" className="border-t border-border">
      <SectionHeader
        eyebrow="Security & control"
        title="Designed so you stay in control."
        description="FLOWA is built with clear boundaries between customers, the AI and your business data."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {security.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} as="li" delay={(i % 5) * 50}>
              <Card className="h-full p-5">
                <Icon className="size-5 text-sage" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 text-[15px] font-medium tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- 15. FINAL CTA + FOOTER ---------- */
export function FinalCta() {
  return (
    <Section id="cta" dark className="py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">
          Your customers already know how to chat.
        </h2>
        <p className="mt-5 text-lg text-charcoal-muted">Let FLOWA handle everything that comes next.</p>
        <div className="mt-9">
          <TryFlowaButton variant="inverse" className="w-full sm:w-auto" />
        </div>
        <p className="mt-6 text-sm text-charcoal-muted">From Conversation to Completion. 🌸</p>
      </Reveal>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">From Conversation to Completion.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#security" className="hover:text-foreground">Security</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Contact on WhatsApp
          </a>
        </nav>
      </div>
      <div className="container-page border-t border-border py-5 text-xs text-muted-foreground">
        © {new Date().getFullYear()} FLOWA. All demo conversations, orders and files on this page are illustrative examples.
      </div>
    </footer>
  );
}
