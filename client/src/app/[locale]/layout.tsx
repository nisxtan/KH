import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import "../globals.css";
import ReduxProvider from "@/store/Provider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client-side component tree
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <CurrencyProvider>
              <div className="flex flex-col min-h-screen bg-ivory relative">
                {/* Fixed Faint Clear God Watermark Background (Global) */}
                <div 
                  className="fixed inset-0 bg-cover bg-no-repeat opacity-[0.20] pointer-events-none z-0"
                  style={{ 
                    backgroundImage: `url('/golden_statue_bg.png')`,
                    backgroundPosition: 'center 15%',
                    filter: 'blur(2px)'
                  }}
                />
                {/* Dark neutral overlay to make gold text pop */}
                <div className="fixed inset-0 bg-black/40 pointer-events-none z-0" />
                
                <div className="relative z-10 flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <ConditionalFooter />
                </div>
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
            </CurrencyProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
