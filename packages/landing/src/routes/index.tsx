import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Problem, MeetFlowa, HowItWorks } from "@/components/landing/Story";
import { Demo } from "@/components/landing/Demo";
import { Features, Watches, Customization, AskFlowa, Handoff } from "@/components/landing/Features";
import {
  BusinessTypes,
  NoNewWorkflow,
  GetStarted,
  Security,
  FinalCta,
  Footer,
} from "@/components/landing/Closing";

const title = "FLOWA — From Conversation to Completion";
const description =
  "FLOWA is the AI commerce operations layer for businesses that sell through WhatsApp. It turns customer conversations into structured orders and coordinates payment, fulfillment, delivery and completion.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <MeetFlowa />
        <HowItWorks />
        <Demo />
        <Features />
        <Watches />
        <Customization />
        <AskFlowa />
        <Handoff />
        <BusinessTypes />
        <NoNewWorkflow />
        <GetStarted />
        <Security />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
