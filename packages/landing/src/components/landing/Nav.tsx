import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TryFlowaButton } from "./primitives";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#features", label: "Features" },
  { href: "#businesses", label: "Who it's for" },
  { href: "#security", label: "Security" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="grid size-7 place-items-center rounded-lg bg-sage text-primary-foreground" aria-hidden>
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
      <span className="text-[15px]">FLOWA</span>
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled || open ? "border-b border-border bg-background/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <TryFlowaButton size="sm" />
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background md:hidden">
          <ul className="container-page flex flex-col py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base text-foreground hover:bg-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="px-2 pt-2 pb-2">
              <TryFlowaButton className="w-full" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
