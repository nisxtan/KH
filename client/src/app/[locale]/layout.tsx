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
import PageTransition from "@/components/ui/PageTransition";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'Kiran Handicraft Enterprises | Divine Hand-Carved Statues of Nepal',
    ne: 'किरण हस्तकला उद्योग | नेपालका दिव्य मूर्तिहरू',
    zh: '基兰手工艺品企业 | 尼泊尔神圣雕像',
    de: 'Kiran Kunsthandwerk | Göttliche handgemeißelte Statuen aus Nepal',
    fr: 'Entreprises Kiran Artisanat | Statues sacrées sculptées à la main du Népal',
    es: 'Kiran Artesanías | Estatuas sagradas talladas a mano de Nepal',
  };
  const descs: Record<string, string> = {
    en: 'Elite hand-carved statues and ritual art created by master artisans in the ancient tradition of Himalayan craftsmanship in Boudha, Kathmandu.',
    ne: 'बौद्ध, काठमाडौंमा हिमाली हस्तकलाको प्राचीन परम्परामा मास्टर कालिगढहरूद्वारा बनाइएको उत्कृष्ट हस्तनिर्मित धातुका मूर्तिहरू र अनुष्ठान कला।',
    zh: '由加德满都博达哈的工艺大师按照喜马拉雅传统手工艺制作的精美手雕金属雕像和仪式艺术品。',
    de: 'Erlesene handgefertigte Metallstatuen und rituelle Kunst, hergestellt von nepalesischen Kunsthandwerkern in Boudha, Kathmandu.',
    fr: 'Statues en métal et art rituel de qualité supérieure, sculptés à la main par des maîtres artisans à Boudha, Katmandou.',
    es: 'Estatuas de metal de alta calidad talladas a mano y arte ritual creado por maestros artesanos en Boudha, Katmandú.',
  };
  return {
    title: titles[locale] || titles.en,
    description: descs[locale] || descs.en,
    icons: {
      icon: '/logo.png',
    },
  };
}

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

  const fontClass =
    locale === 'ne' ? 'font-devanagari' : locale === 'zh' ? 'font-cjk' : '';

  return (
    <html lang={locale}>
      <body className={fontClass ? `antialiased ${fontClass}` : 'antialiased'}>
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
                  <main className="flex-grow flex flex-col">
                    <PageTransition>
                      {children}
                    </PageTransition>
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
