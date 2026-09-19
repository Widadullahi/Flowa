import { Check, CheckCheck, Mic, Paperclip, Sparkles, MapPin, CalendarDays, Clock } from "lucide-react";
import { Reveal, Section, SectionHeader } from "./primitives";

function Bubble({
  from,
  children,
  time,
}: {
  from: "customer" | "business";
  children: React.ReactNode;
  time: string;
}) {
  const mine = from === "business";
  return (
    <div className={mine ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug shadow-[0_1px_1px_oklch(0_0_0/6%)] " +
          (mine ? "rounded-br-md bg-whatsapp-bubble text-foreground" : "rounded-bl-md bg-card text-foreground")
        }
      >
        <p>{children}</p>
        <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          {time}
          {mine && <CheckCheck className="size-3 text-whatsapp" aria-hidden />}
        </p>
      </div>
    </div>
  );
}

export function Demo() {
  return (
    <Section id="demo" className="border-t border-border">
      <SectionHeader
        eyebrow="Product demo"
        title="A normal message in. A complete order out."
        description="Example conversation and extracted order — demo data for illustration."
      />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* WhatsApp mock */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-whatsapp-bg shadow-float">
            <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
              <div className="grid size-9 place-items-center rounded-full bg-sage-soft text-sm font-semibold text-sage">
                SB
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Sweet Bloom Cakes</p>
                <p className="text-xs text-muted-foreground">Business account · Powered by FLOWA</p>
              </div>
            </div>
            <div className="dot-grid space-y-3 px-4 py-5">
              <p className="mx-auto w-fit rounded-md bg-card px-2 py-0.5 text-[10px] text-muted-foreground uppercase">
                Today
              </p>
              <Bubble from="customer" time="10:12">
                Hi, I need a 10-inch chocolate cake for Saturday. Navy blue and gold, write Happy
                Birthday Tolu. I'm in Lekki. Can you add a pink balloon box too?
              </Bubble>
              <Bubble from="business" time="10:12">
                Hi! 🌸 Got it — a 10" chocolate cake in navy &amp; gold with "Happy Birthday Tolu",
                plus a pink balloon gift box, delivered to Lekki on Saturday. What time works best for
                delivery?
              </Bubble>
              <Bubble from="customer" time="10:13">
                4pm please
              </Bubble>
              <Bubble from="business" time="10:13">
                Perfect. Your order #1042 is ready to confirm. Total ₦48,500 including Lekki
                delivery. Here's your secure payment link: pay.example/1042
              </Bubble>
              <Bubble from="customer" time="10:16">
                Paid ✅
              </Bubble>
              <Bubble from="business" time="10:16">
                Payment received — thank you! Your cake is scheduled for production and I'll update
                you when it's out for delivery on Saturday.
              </Bubble>
            </div>
            <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
              <Paperclip className="size-4 text-muted-foreground" aria-hidden />
              <div className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                Message
              </div>
              <Mic className="size-4 text-muted-foreground" aria-hidden />
            </div>
          </div>
        </Reveal>

        {/* Order card */}
        <Reveal delay={120}>
          <div className="flex h-full flex-col rounded-3xl border border-border bg-card shadow-float">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-sage text-primary-foreground">
                  <Sparkles className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm font-medium">Structured by FLOWA</span>
              </div>
              <span className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-sage">
                Confirmed
              </span>
            </div>
            <div className="flex-1 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-semibold tracking-tight">Order #1042</h3>
                <span className="text-xs text-muted-foreground">Example</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Customer · +234 ••• ••• 8821</p>

              <dl className="mt-6 divide-y divide-border">
                <Row label="Item" value={'10" Chocolate Cake'} />
                <Row label="Colours" value="Navy + Gold" />
                <Row label="Inscription" value="Happy Birthday Tolu" />
                <Row label="Add-on" value="Balloon Gift Box (pink)" />
              </dl>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <Pill icon={MapPin} label="Location" value="Lekki" />
                <Pill icon={CalendarDays} label="Date" value="Saturday" />
                <Pill icon={Clock} label="Time" value="4:00 PM" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-3xl border-t border-border bg-background px-6 py-4">
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Check className="size-4 text-sage" aria-hidden /> Paid · ₦48,500
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Next step</p>
                <p className="text-sm font-medium">Production · Fri</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

function Pill({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <Icon className="size-4 text-sage" aria-hidden />
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
