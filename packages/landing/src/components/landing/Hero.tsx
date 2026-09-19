import { MessageCircle, Sparkles, ClipboardList, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { Badge, ButtonLink, TryFlowaButton } from "./primitives";

const steps = [
  { icon: MessageCircle, label: "Customer Chat", sub: "WhatsApp" },
  { icon: Sparkles, label: "FLOWA AI", sub: "Understands" },
  { icon: ClipboardList, label: "Order", sub: "#1042 created" },
  { icon: CreditCard, label: "Payment", sub: "Confirmed" },
  { icon: Truck, label: "Delivery", sub: "Lekki · Sat" },
  { icon: CheckCircle2, label: "Completed", sub: "Customer notified" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-14 pb-16 sm:pt-24 sm:pb-24">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <Badge>
              <span className="size-1.5 rounded-full bg-sage" aria-hidden />
              AI-Powered Commerce Operations
            </Badge>
          </div>
          <h1
            className="animate-fade-up mt-6 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            From Conversation to Completion.
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Your customers already know how to WhatsApp you. FLOWA turns those conversations into
            organized orders, payments, fulfillment and delivery — automatically.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "180ms" }}
          >
            <TryFlowaButton className="w-full sm:w-auto" />
            <ButtonLink href="#how-it-works" variant="secondary" size="lg" className="w-full sm:w-auto">
              See How It Works
            </ButtonLink>
          </div>
          <p className="animate-fade-up mt-4 text-xs text-muted-foreground" style={{ animationDelay: "220ms" }}>
            Your customers chat. FLOWA handles the rest.
          </p>
        </div>

        {/* Workflow visual */}
        <div className="animate-fade-up mt-14 sm:mt-20" style={{ animationDelay: "280ms" }}>
          <div className="relative rounded-3xl border border-border bg-card/70 p-4 shadow-float backdrop-blur-sm sm:p-8">
            <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0" aria-label="FLOWA workflow">
              {/* connector line desktop */}
              <svg
                className="pointer-events-none absolute top-[38px] right-[8%] left-[8%] hidden h-px w-[84%] lg:block"
                aria-hidden
              >
                <line
                  x1="0"
                  y1="0.5"
                  x2="100%"
                  y2="0.5"
                  className="animate-flow stroke-sage"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
              </svg>
              {steps.map((s, i) => {
                const Icon = s.icon;
                const last = i === steps.length - 1;
                const isAI = i === 1;
                return (
                  <li key={s.label} className="relative flex flex-col items-center px-2 py-3 text-center">
                    <div
                      className={
                        "relative grid size-[54px] place-items-center rounded-2xl border transition-colors " +
                        (isAI
                          ? "border-sage bg-sage text-primary-foreground shadow-card"
                          : last
                            ? "border-sage/40 bg-sage-soft text-sage"
                            : "border-border bg-card text-foreground")
                      }
                    >
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                      {isAI && (
                        <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-sage ring-2 ring-card animate-pulse-soft" aria-hidden />
                      )}
                    </div>
                    <p className="mt-3 text-sm font-medium">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
                    <span className="sr-only">{i < steps.length - 1 ? "then" : ""}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Illustrative flow with example data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
