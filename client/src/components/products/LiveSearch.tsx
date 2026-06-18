'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { useRouter } from 'next/navigation';

interface Suggestion {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  category: string;
}

interface LiveSearchProps {
  initialSearch?: string;
  placeholder: string;
  locale: string;
  recommendedTitle?: string;
  suggestionsTitle?: string;
  noResultsText?: string;
}

export default function LiveSearch({
  initialSearch = '',
  placeholder,
  locale,
  recommendedTitle = 'Recommended Masterpieces',
  suggestionsTitle = 'Suggestions',
  noResultsText = 'No matches found'
}: LiveSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestion fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/products/search/suggestions?q=${encodeURIComponent(query)}&lang=${locale}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (isOpen) {
        fetchSuggestions();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen, locale]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/${locale}/products/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    router.push(`/${locale}/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full md:w-80 z-40">
      <form onSubmit={handleSubmit} className="relative group">
        <Search 
          className="absolute left-6 top-1/2 -translate-y-1/2 text-ivory/40 group-focus-within:text-gold transition-colors" 
          size={18} 
        />
        <input 
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-black/40 backdrop-blur-md border border-gold/20 rounded-2xl pl-16 pr-12 py-5 text-ivory font-medium focus:outline-none focus:border-gold/50 transition-all text-sm placeholder:text-ivory/30"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold animate-spin" size={16} />
        )}
      </form>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-black/80 backdrop-blur-xl border border-gold/25 shadow-2xl rounded-3xl p-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-96 overflow-y-auto scrollbar-hide">
          <p className="text-[9px] font-black uppercase tracking-widest text-gold mb-3 px-2">
            {query.trim() ? suggestionsTitle : recommendedTitle}
          </p>

          <div className="space-y-1">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.slug)}
                  className="w-full flex items-center gap-4 p-2 rounded-2xl hover:bg-gold/20 text-left transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-gold/20 flex-shrink-0">
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
                    <p className="text-xs font-black truncate text-ivory group-hover:text-gold">
                      {item.name}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              !loading && (
                <p className="text-center py-6 text-xs text-ivory/40 font-bold uppercase tracking-wider">
                  {noResultsText}
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
