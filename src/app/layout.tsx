import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// latin-ext carries the Czech letters (ě, š, č, ř, ž, ů)
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vojtěch Sýkora",
  description:
    "AI engineer in Prague. Senior Software Engineer, AI at RapidSOS: I lead AI transformation, from the platform to the product.",
  metadataBase: new URL("https://vojtechsykora.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: dark only if the visitor chose it; light is the default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle("dark",localStorage.getItem("theme")==="dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-paper text-ink">
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-ink text-paper px-3 py-2">
          Skip to content
        </a>
        <Nav />
        <main id="content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
