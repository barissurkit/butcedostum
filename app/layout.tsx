import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "BütçeDostum",
    template: "BütçeDostum | %s",
  },
  description: "Gelir ve giderlerini ekle, özetini anlık gör.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <div className="brand-badge">₺</div>
              <div>BütçeDostum</div>
            </div>

            <div className="muted">Bütçenizi takip eden bir "Dost".</div>
          </div>
        </div>

        <div className="container">{children}</div>
      </body>
    </html>
  );
}
