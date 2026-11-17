import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Atmosphere from "@/components/Atmosphere";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { site } from "@/lib/site";

const grotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} | Portfolio`,
  description: site.description,
  openGraph: { title: `${site.name} | Portfolio`, description: site.description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0A0F24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>
        <AuthProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Atmosphere />
          <ScrollProgress />
          <Cursor />
          <Navbar />
          {children}
          <LoginModal />
        </AuthProvider>
      </body>
    </html>
  );
}
