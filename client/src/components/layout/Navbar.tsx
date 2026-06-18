'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/api/axios';
import { X, Menu, ChevronRight, Globe, Search, Loader2 } from 'lucide-react';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [langDropdown, setLangDropdown] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ pages: any[], products: any[] }>({ pages: [], products: [] });
  const [searchLoading, setSearchLoading] = useState(false);

  const staticPages = [
    { name: t('gallery') || 'Gallery', href: '/products', type: 'page', desc: 'Browse our full catalog of hand-carved statues' },
    { name: t('about') || 'About Us', href: '/about', type: 'page', desc: 'Learn about our history and master artisans' },
    { name: t('contact') || 'Contact', href: '/contact', type: 'page', desc: 'Get in touch for showroom visits or inquiries' },
    { name: 'Commission a Piece', href: '/contact', type: 'page', desc: 'Start a custom order for a bespoke masterpiece' },
  ];

  const filteredPages = staticPages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults({ pages: [], products: [] });
      return;
    }

    if (!searchQuery.trim()) {
      setSearchResults({ pages: staticPages, products: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await axiosInstance.get(`/products/search/suggestions?q=${encodeURIComponent(searchQuery)}&lang=${locale}`);
        setSearchResults({
          pages: filteredPages,
          products: res.data || []
        });
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults({ pages: filteredPages, products: [] });
      } finally {
        setSearchLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, isSearchOpen, locale]);

  const navLinks = [
    { name: t('gallery'), href: '/products' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    axiosInstance.get(`/settings?lang=${locale}`).then(res => setSettings(res.data)).catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, [locale]);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenu]);

  const siteName = settings['general_site_name'] || 'Kiran Handicraft Enterprises';
  const tagline = settings['general_tagline'] || 'Wholesaler, Retailer & Manufacturer';

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className={`w-full px-6 md:px-16 h-16 md:h-20 flex justify-between items-center transition-all duration-500 pointer-events-auto border-b ${
          scrolled 
            ? 'bg-black border-gold/20 shadow-2xl' 
            : 'bg-transparent border-transparent'
        }`}>
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="bg-espresso w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-gold/20 shadow-xl transition-all group-hover:scale-110 group-hover:bg-gold-dark shrink-0 overflow-hidden">
              <img src="/logo.png" alt="Kiran Handicraft Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col max-w-[110px] xs:max-w-[130px] sm:max-w-none">
              <h1 className="text-[9px] sm:text-base md:text-xl font-extrabold tracking-tight uppercase leading-tight line-clamp-2 sm:line-clamp-none text-ivory">{siteName}</h1>
              <p className="text-[7px] md:text-[9.5px] font-semibold uppercase tracking-[0.25em] leading-none mt-1 sm:block hidden text-gold">{tagline}</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 bg-black/30 backdrop-blur-xl px-8 py-3 rounded-full border border-gold/20 shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[10.5px] uppercase tracking-[0.22em] font-bold transition-all relative py-1 group ${
                    isActive ? 'text-gold' : 'text-ivory/90 hover:text-gold'
                  }`}
                >
                  {link.name}
                  {isActive ? (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Global Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center bg-gold/25 text-ivory p-3.5 rounded-xl border border-gold/35 hover:bg-gold-dark hover:text-espresso hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md group"
              title="Search Site"
            >
              <Search size={14} className="text-gold group-hover:text-espresso" />
            </button>

            {/* Language Switcher */}
            <div className="relative pointer-events-auto hidden md:block">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-2 bg-gold/25 text-ivory px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.22em] border border-gold/35 hover:bg-gold/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
              >
                <Globe size={13} className="text-gold" />
                {locale.toUpperCase()}
              </button>
              <AnimatePresence>
                {langDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLangDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 bg-espresso border border-gold/25 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                    >
                      {['en', 'fr', 'zh', 'de', 'es', 'ne'].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            handleLocaleChange(loc);
                            setLangDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em] hover:bg-gold/10 transition-all ${
                            locale === loc ? 'text-gold' : 'text-ivory/70 hover:text-ivory'
                          }`}
                        >
                          {loc === 'en' ? 'English' : loc === 'fr' ? 'Français' : loc === 'zh' ? '中文' : loc === 'de' ? 'Deutsch' : loc === 'es' ? 'Español' : 'नेपाली'}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/contact"
              className="hidden md:block bg-espresso text-sacred border border-gold/30 px-9 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-gold-dark hover:text-espresso transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              {t('inquire')}
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2.5 rounded-xl bg-espresso text-sacred border border-gold/10 hover:bg-gold-dark hover:text-espresso transition-all shadow-lg active:scale-95 shrink-0"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-[100] md:hidden"
            />
            
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-black/90 backdrop-blur-xl z-[101] md:hidden shadow-2xl flex flex-col border-l border-gold/20"
            >
              <div className="p-8 flex items-center justify-between border-b border-gold/20">
                <div className="flex items-center gap-3">
                  <div className="bg-espresso w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                    <img src="/logo.png" alt="Kiran Handicraft Logo" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase tracking-tighter leading-tight text-ivory">{siteName}</h2>
                </div>
                <button 
                  onClick={() => setMobileMenu(false)}
                  className="p-3 rounded-xl bg-black/40 border border-gold/20 text-gold hover:bg-gold-dark hover:text-espresso transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold mb-6">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center justify-between w-full p-6 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                      pathname === link.href 
                        ? 'bg-gold text-espresso shadow-xl' 
                        : 'text-ivory/80 hover:bg-white/10 hover:text-gold'
                    }`}
                  >
                    {link.name}
                    <ChevronRight size={16} className={pathname === link.href ? 'text-espresso' : 'text-ivory/20'} />
                  </Link>
                ))}
              </div>

              <div className="p-8 space-y-6">
                {/* Mobile Language Selection */}
                <div className="space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gold mb-3">Language</p>
                  <div className="flex gap-2 flex-wrap">
                    {['en', 'fr', 'zh', 'de', 'es', 'ne'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          handleLocaleChange(loc);
                          setMobileMenu(false);
                        }}
                        className={`min-w-[calc(33.33%-6px)] flex-grow py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          locale === loc 
                            ? 'bg-gold text-espresso border border-gold shadow-md' 
                            : 'bg-white/10 text-ivory/60 border border-gold/20'
                        }`}
                      >
                        {loc.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center bg-gold text-espresso py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {t('commission')}
                </Link>
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-ivory/30">
                    Handcrafted in Nepal Since 1988
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[110] flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-espresso/70 backdrop-blur-md pointer-events-auto"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-2xl bg-espresso border border-gold/25 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col z-20 pointer-events-auto max-h-[75vh]"
            >
               {/* Input Header */}
              <div className="relative border-b border-gold/15 p-6 flex items-center gap-4">
                <Search size={20} className="text-gold" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search statues, collections, pages..."
                  className="flex-1 bg-transparent text-ivory placeholder:text-ivory/50 focus:outline-none text-base font-bold"
                />
                {searchLoading && (
                  <Loader2 size={16} className="text-gold animate-spin" />
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-ivory/50 hover:text-ivory transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {/* Pages Section */}
                {searchResults.pages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold px-2">Site Pages</p>
                    <div className="grid grid-cols-1 gap-1">
                      {searchResults.pages.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => {
                            setIsSearchOpen(false);
                            router.push(p.href);
                          }}
                          className="w-full text-left p-3.5 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-[14px] font-bold text-ivory group-hover:text-gold transition-colors">{p.name}</p>
                            <p className="text-xs font-medium text-ivory/65 mt-1">{p.desc}</p>
                          </div>
                          <ChevronRight size={14} className="text-ivory/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {searchResults.products.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold px-2">Statues & Masterpieces</p>
                    <div className="grid grid-cols-1 gap-1">
                      {searchResults.products.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            router.push(`/products/${item.slug}`);
                          }}
                          className="w-full text-left p-2.5 rounded-2xl hover:bg-gold/10 hover:text-gold transition-all flex items-center gap-4 group"
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-gold/20 flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gold/10 flex items-center justify-center text-[10px] text-gold font-bold">KH</div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-bold truncate text-ivory group-hover:text-gold transition-colors">{item.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ivory/65 mt-1">{item.category}</p>
                          </div>
                          <ChevronRight size={14} className="text-ivory/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all pr-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results Placeholder */}
                {searchResults.pages.length === 0 && searchResults.products.length === 0 && !searchLoading && searchQuery.trim() && (
                  <div className="py-12 text-center text-ivory/40">
                    <p className="text-sm font-bold uppercase tracking-wider">No Results Found</p>
                    <p className="text-xs mt-1">Try searching for other keywords like "buddha", "about", or "contact".</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
