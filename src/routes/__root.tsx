import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AppProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-black gradient-text">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 rounded-xl gradient-primary text-white neon-glow">Go Home</a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "E-Learning Nova University — جامعة المستقبل التقنية" },
      { name: "description", content: "جامعة E-Learning Nova: 4 كليات، 8 أقسام تقنية متخصصة، شهادات معتمدة دوليًا، ولوحة طالب جامعي متكاملة" },
      { property: "og:title", content: "E-Learning Nova University" },
      { property: "og:description", content: "Future-ready university: AI, Networks, Cybersecurity, Software, Data, Design" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <AuthProvider>
        <Outlet />
        <Toaster position="bottom-right" expand={true} richColors />
      </AuthProvider>
    </AppProvider>
  );
}
