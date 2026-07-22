import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/PageLoader";
import CartFly from "@/components/CartFly";
import SocialNotification from "@/components/SocialNotification";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Plus_Jakarta_Sans({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TOASTY® — Feito para você voltar",
  description:
    "Premium Toast Restaurant. Sanduíches redondos tostados artesanais com ingredientes selecionados. Peça agora.",
  keywords: [
    "toasty",
    "sanduíche",
    "toast",
    "restaurante",
    "premium",
    "delivery",
    "cardápio",
  ],
  openGraph: {
    title: "TOASTY® — Feito para você voltar",
    description:
      "Premium Toast Restaurant. Sanduíches redondos tostados artesanais.",
    url: "https://toasty.com.br",
    siteName: "TOASTY",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TOASTY — Premium Toast Restaurant",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOASTY® — Feito para você voltar",
    description: "Premium Toast Restaurant.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "TOASTY",
  description:
    "Premium Toast Restaurant — Sanduíches redondos tostados artesanais.",
  url: "https://toasty.com.br",
  servesCuisine: "Sanduíches",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  menu: "https://toasty.com.br#cardapio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <ToastProvider>
                <PageLoader />
                <CartFly />
                <SocialNotification />
                {children}
              </ToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
