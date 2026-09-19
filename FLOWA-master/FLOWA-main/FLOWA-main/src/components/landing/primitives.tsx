import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/site-config";

/* ---------- Reveal on scroll ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ---------- Buttons ---------- */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-sage shadow-card",
        secondary: "border border-border bg-card text-foreground hover:border-foreground/40 hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary",
        inverse: "bg-charcoal-foreground text-charcoal hover:bg-sage hover:text-charcoal-foreground",
        inverseOutline:
          "border border-charcoal-border text-charcoal-foreground hover:bg-charcoal-card focus-visible:ring-offset-charcoal",
      },
      size: {
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        sm: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function TryFlowaButton({
  variant = "primary",
  size = "lg",
  className,
}: VariantProps<typeof buttonVariants> & { className?: string }) {
  return (
    <ButtonLink
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={cn("group", className)}
    >
      Try FLOWA Now
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </ButtonLink>
  );
}

/* ---------- Section scaffolding ---------- */
export function Section({
  id,
  className,
  children,
  dark = false,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-20 sm:py-28",
        dark && "bg-charcoal text-charcoal-foreground",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl sm:mb-16",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-pretty sm:text-lg",
            dark ? "text-charcoal-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-float",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
