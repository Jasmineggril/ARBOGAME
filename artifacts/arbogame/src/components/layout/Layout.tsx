import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { SiteJourney } from "./SiteJourney";
import { Footer } from "./Footer";
import { IntroOverlay } from "../intro/IntroOverlay";
import { CursorTrail } from "../intro/CursorTrail";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <IntroOverlay />
      <CursorTrail />
      <Navbar />
      <SiteJourney />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
