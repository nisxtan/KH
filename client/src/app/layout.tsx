import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/Provider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "Kiran Handicraft Pvt Ltd | Premium Statues from Nepal",
  description: "Exquisite handcrafted statues and handicrafts from Bouddha, Kathmandu. Spiritual and artistic excellence.",
  keywords: "handicraft, statues, buddha, nepal, kathmandu, bouddha, kiran handicraft, spiritual art",
  openGraph: {
    title: "Kiran Handicraft Pvt Ltd",
    description: "Premium handcrafted statues and handicrafts from Nepal.",
    url: "https://kiranhadicraft.com",
    siteName: "Kiran Handicraft",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <div className="flex flex-col min-h-screen bg-ivory">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <WhatsAppButton />
          <Toaster position="top-right" toastOptions={{
            style: {
              borderRadius: '1.5rem',
              background: '#fdfaf5',
              color: '#2d1b0d',
              border: '1px solid rgba(212,175,55,0.2)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
            },
          }} />
        </ReduxProvider>
      </body>
    </html>
  );
}
