import ProductCard from "@/components/products/ProductCard";
import axiosInstance from "@/api/axios";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, LayoutGrid } from "lucide-react";

async function getProducts(params: any) {
  try {
    const queryParams = new URLSearchParams();
    if (params.categorySlug && params.categorySlug !== 'All') queryParams.append('categorySlug', params.categorySlug);
    if (params.page) queryParams.append('page', params.page);
    if (params.search) queryParams.append('search', params.search);
    queryParams.append('limit', '12');

    const res = await axiosInstance.get(`/products?${queryParams.toString()}`);
    return res.data;
  } catch {
    return { items: [], total: 0, page: 1, totalPages: 1 };
  }
}

async function getCategories() {
  try {
    const res = await axiosInstance.get('/categories');
    return res.data;
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; search?: string }>;
}) {
  const { category: categorySlug, page, search } = await searchParams;
  const [{ items: products, total, totalPages, page: currentPage }, categories] = await Promise.all([
    getProducts({ categorySlug, page, search }),
    getCategories()
  ]);

  const categoryList = [{ name: 'All', slug: 'All' }, ...categories];

  return (
    <div className="bg-ivory min-h-screen pt-32 pb-40">
      <div className="container mx-auto px-4 md:px-6">

        {/* ─── Header ─── */}
        <div className="mb-10 md:mb-20">
          <span className="section-badge mb-4 block text-center md:text-left">
            <span className="h-px w-8 bg-gold-dark" /> Divine Gallery
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tighter text-espresso uppercase leading-[0.9]">
                Sacred <br />
                <span className="text-divine-gold">Collection</span>
              </h1>
              <p className="text-[10px] text-espresso/40 font-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <LayoutGrid size={12} /> {total} Masterpieces Registered
              </p>
            </div>    
            {/* Search Bar */}
            <form action="/products" className="relative group w-full md:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-espresso/20 group-focus-within:text-gold transition-colors" size={18} />
              <input 
                name="search"
                defaultValue={search}
                placeholder="Search statues..."
                className="w-full bg-sacred border border-gold/10 rounded-2xl pl-16 pr-6 py-5 text-espresso font-medium focus:outline-none focus:border-gold/30 transition-all shadow-sm"
              />
            </form>
          </div>
        </div>

        {/* ─── Category Filters ─── */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-12 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {categoryList.map((cat: any) => {
            const isActive = (!categorySlug && cat.name === "All") || categorySlug === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={cat.name === "All" ? "/products" : `/products?category=${cat.slug}${search ? `&search=${search}` : ''}`}
                className={`whitespace-nowrap px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border flex-shrink-0 ${
                  isActive
                    ? "bg-espresso text-sacred border-espresso shadow-xl scale-105"
                    : "bg-sacred text-espresso/50 border-gold/10 hover:border-gold/30 hover:text-espresso"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* ─── Product Grid ─── */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                {currentPage > 1 && (
                  <Link 
                    href={`/products?page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}
                    className="p-5 rounded-2xl bg-sacred border border-gold/10 text-espresso hover:bg-gold hover:text-espresso transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </Link>
                )}
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    const isCurrent = p === currentPage;
                    return (
                      <Link
                        key={p}
                        href={`/products?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all border ${
                          isCurrent ? "bg-espresso text-sacred border-espresso" : "bg-sacred text-espresso/40 border-gold/10 hover:border-gold"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link 
                    href={`/products?page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}
                    className="p-5 rounded-2xl bg-sacred border border-gold/10 text-espresso hover:bg-gold hover:text-espresso transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center">
            <div className="inline-block p-16 rounded-[3rem] bg-sacred border border-gold/10 mb-8">
              <div className="flex justify-center text-espresso/20 mb-8"><LayoutGrid size={64} /></div>
              <h3 className="text-2xl font-black tracking-tighter text-espresso mb-2">Gallery Being Curated</h3>
              <p className="text-espresso/40 text-sm">
                No pieces found. Try a different category or search term.
              </p>
            </div>
            <Link href="/products" className="block text-[10px] font-black uppercase tracking-widest text-espresso/40 hover:text-gold transition-colors">
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
