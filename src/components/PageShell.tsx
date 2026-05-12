import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({ children, hideFooter }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
