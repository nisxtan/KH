import ProductCard from "@/components/products/ProductCard";
import LiveSearch from "@/components/products/LiveSearch";
import axiosInstance from "@/api/axios";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import AnimatedText from "@/components/ui/AnimatedText";
import SacredGeometry from "@/components/ui/SacredGeometry";

async function getProducts(params: any) {
  try {
    const queryParams = new URLSearchParams();
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page);
    if (params.search) queryParams.append('search', params.search);
    if (params.locale) queryParams.append('lang', params.locale);
    queryParams.append('limit', '10');

    const res = await axiosInstance.get(`/products?${queryParams.toString()}`);
    return res.data;
  } catch {
    return { items: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string; page?: string; search?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Products');
  const { sort, page, search } = await searchParams;
  const { items: products, total, totalPages, page: currentPage } = await getProducts({ sort, page, search, locale });

  const safeCurrentPage = Number(currentPage) || 1;
  const safeTotalPages = Number(totalPages) || 1;
  const isPrevDisabled = safeCurrentPage <= 1;
  const isNextDisabled = safeCurrentPage >= safeTotalPages;

  const buildHref = (p: number) =>
    `/products?page=${p}${sort ? `&sort=${sort}` : ''}${search ? `&search=${search}` : ''}`;

  return (
    <div className="bg-transparent min-h-screen pt-32 pb-20 relative overflow-hidden">
      <div className="absolute right-0 top-1/4 translate-x-1/3 opacity-[0.03] pointer-events-none z-0">
        <SacredGeometry pattern="lotus" className="w-[600px] h-[600px]" color="#D4AF37" rotationSpeed={160} />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* ─── Header ─── */}
        <div className="mb-8 md:mb-16">
          <span className="section-badge mb-4 block text-center md:text-left">
            <span className="h-px w-8 bg-gold-dark" /> {t('divineGallery')}
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tighter text-ivory uppercase leading-[0.9]">
                <AnimatedText text={t('sacred')} animationType="words" direction="up" delay={0.05} /> <br />
                <AnimatedText text={t('collection')} animationType="letters" direction="up" delay={0.15} className="text-divine-gold" underline />
              </h1>
              <p className="text-[10px] text-ivory/40 font-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <LayoutGrid size={12} /> {t('registered', { count: total })}
              </p>
            </div>
            {/* Search Bar */}
            <LiveSearch
              initialSearch={search}
              placeholder={t('searchPlaceholder')}
              locale={locale}
              recommendedTitle={t('recommendedTitle')}
              suggestionsTitle={t('suggestionsTitle')}
              noResultsText={t('noResultsText')}
            />
          </div>
        </div>

        {/* ─── Price / Sort Filters ─── */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {[
            { name: t('sortNewest'), value: '' },
            { name: t('priceLowHigh'), value: 'price_asc' },
            { name: t('priceHighLow'), value: 'price_desc' }
          ].map((option) => {
            const isActive = sort === option.value || (!sort && option.value === '');
            return (
              <Link
                key={option.name}
                href={`/products?sort=${option.value}${search ? `&search=${search}` : ''}`}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border flex-shrink-0 ${
                  isActive
                    ? "bg-gold text-espresso border-gold shadow-xl scale-105"
                    : "bg-black/40 backdrop-blur-md text-ivory/60 border-gold/20 hover:border-gold/50 hover:text-ivory"
                }`}
              >
                {option.name}
              </Link>
            );
          })}
        </div>

        {/* ─── Product Grid ─── */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-block p-16 rounded-[3rem] bg-black/40 backdrop-blur-md border border-gold/20 mb-8">
              <div className="flex justify-center text-ivory/20 mb-8"><LayoutGrid size={64} /></div>
              <h3 className="text-2xl font-black tracking-tighter text-ivory mb-2">{t('curating')}</h3>
              <p className="text-ivory/40 text-sm">{t('noPieces')}</p>
            </div>
            <Link href="/products" className="block text-[10px] font-black uppercase tracking-widest text-ivory/40 hover:text-gold transition-colors">
              {t('resetFilters')}
            </Link>
          </div>
        )}

        {/* ─── Pagination (always visible) ─── */}
        <div className="mt-12 flex items-center justify-center gap-4">
          {/* Prev Button */}
          {isPrevDisabled ? (
            <span className="p-4 rounded-2xl bg-black/20 border border-gold/10 text-ivory/20 cursor-not-allowed select-none">
              <ChevronLeft size={18} />
            </span>
          ) : (
            <Link
              href={buildHref(safeCurrentPage - 1)}
              className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-gold/20 text-ivory hover:bg-gold hover:text-espresso hover:border-gold transition-all"
            >
              <ChevronLeft size={18} />
            </Link>
          )}

          {/* Page X of Y */}
          <div className="px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-gold/20 text-center min-w-[120px]">
            <p className="text-[9px] font-black uppercase tracking-widest text-gold">Page</p>
            <p className="text-sm font-black text-ivory">
              {safeCurrentPage} <span className="text-ivory/40">of</span> {safeTotalPages}
            </p>
          </div>

          {/* Next Button */}
          {isNextDisabled ? (
            <span className="p-4 rounded-2xl bg-black/20 border border-gold/10 text-ivory/20 cursor-not-allowed select-none">
              <ChevronRight size={18} />
            </span>
          ) : (
            <Link
              href={buildHref(safeCurrentPage + 1)}
              className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-gold/20 text-ivory hover:bg-gold hover:text-espresso hover:border-gold transition-all"
            >
              <ChevronRight size={18} />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
