'use client';

import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/api/axios';
import { toast } from 'react-hot-toast';
import { X, Upload, Plus, Search, ChevronDown, Check, LayoutGrid, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    size: '',
    material: '',
    categoryId: '',
    images: [],
    featured: false,
    available: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [catSearch, setCatSearch] = useState('');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data);
        if (initialData?.category?.id) {
          setFormData((prev: any) => ({ ...prev, categoryId: initialData.category.id }));
        }
      } catch {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCatDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const data = new FormData();
    files.forEach(file => data.append('images', file));

    setUploading(true);
    try {
      const response = await axiosInstance.post('/products/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, images: [...formData.images, ...response.data.images] });
      toast.success('Images uploaded');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
        toast.error('Please select a category');
        return;
    }
    try {
      if (initialData) {
        await axiosInstance.put(`/products/${initialData.id}`, formData);
        toast.success('Product updated');
      } else {
        await axiosInstance.post('/products', formData);
        toast.success('Product created');
      }
      onSuccess();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const selectedCategoryName = categories.find(c => c.id === Number(formData.categoryId))?.name || 'Select Category';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 bg-sacred p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-divine border border-gold/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        
        {/* Name */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Product Name</label>
          <input
            type="text"
            className="w-full bg-ivory/30 border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso font-medium focus:outline-none transition-all shadow-inner"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g. Shakyamuni Buddha"
          />
        </div>
        
        {/* Category (Searchable Select) */}
        <div className="space-y-4 relative" ref={dropdownRef}>
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Category</label>
          <div 
            onClick={() => setShowCatDropdown(!showCatDropdown)}
            className={`w-full bg-ivory/30 border border-gold/15 rounded-2xl px-6 py-5 text-espresso font-medium cursor-pointer flex items-center justify-between transition-all shadow-inner ${showCatDropdown ? 'border-gold ring-4 ring-gold/5' : ''}`}
          >
            <span className={formData.categoryId ? 'text-espresso' : 'text-espresso/30'}>{selectedCategoryName}</span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${showCatDropdown ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showCatDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute z-50 top-full left-0 right-0 mt-3 bg-sacred border border-gold/20 rounded-[2rem] shadow-2xl overflow-hidden p-4 space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/20" size={16} />
                  <input 
                    type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full bg-ivory/50 border border-gold/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData({ ...formData, categoryId: cat.id });
                          setShowCatDropdown(false);
                          setCatSearch('');
                        }}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer transition-all ${Number(formData.categoryId) === cat.id ? 'bg-gold text-espresso' : 'hover:bg-gold/10 text-espresso/60 hover:text-espresso'}`}
                      >
                        <span className="text-sm font-bold">{cat.name}</span>
                        {Number(formData.categoryId) === cat.id && <Check size={16} />}
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-xs font-bold text-espresso/20">No categories found</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Price (NPR)</label>
          <input
            type="number"
            className="w-full bg-ivory/30 border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso font-medium focus:outline-none transition-all shadow-inner"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            placeholder="0.00"
          />
        </div>

        {/* Size */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Size</label>
          <input
            type="text"
            className="w-full bg-ivory/30 border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso font-medium focus:outline-none transition-all shadow-inner"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            required
            placeholder="e.g. 18 inches"
          />
        </div>

        {/* Material */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Material</label>
          <input
            type="text"
            className="w-full bg-ivory/30 border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso font-medium focus:outline-none transition-all shadow-inner"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            required
            placeholder="e.g. Copper with Gold Gilding"
          />
        </div>

        {/* Status Swithes */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 pt-6 sm:pt-10">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <div className="w-12 h-6 bg-espresso/10 rounded-full peer peer-checked:bg-gold transition-all" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-sacred rounded-full transition-all peer-checked:translate-x-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-espresso/60 group-hover:text-espresso transition-colors">Featured Item</span>
          </label>
          
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              />
              <div className="w-12 h-6 bg-espresso/10 rounded-full peer peer-checked:bg-green-500 transition-all" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-sacred rounded-full transition-all peer-checked:translate-x-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-espresso/60 group-hover:text-espresso transition-colors">In Stock</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Ritual Description</label>
        <textarea
          rows={5}
          className="w-full bg-ivory/30 border border-gold/15 focus:border-gold rounded-[1.5rem] md:rounded-[2rem] px-6 py-5 md:px-8 md:py-6 text-espresso font-medium focus:outline-none transition-all shadow-inner resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          placeholder="Describe the spiritual significance and artistry..."
        />
      </div>

      {/* Images */}
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Sacred Gallery Images</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {formData.images.map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-gold/20 shadow-lg group/img">
              <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-2 bg-espresso text-sacred rounded-full opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gold/20 rounded-[1.5rem] cursor-pointer hover:border-gold hover:bg-gold/5 transition-all group/upload">
            <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
            <div className="p-4 rounded-full bg-gold/10 text-gold mb-3 group-hover/upload:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <span className="text-[9px] uppercase font-black tracking-widest text-espresso/40">Add Image</span>
          </label>
        </div>
        {uploading && (
          <div className="flex items-center gap-3 text-gold animate-pulse">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Ascending to Cloud...</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-10 border-t border-gold/10">
        <button
          type="submit"
          className="flex-1 bg-espresso text-sacred py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-espresso transition-all shadow-2xl hover:scale-[1.02]"
        >
          {initialData ? 'Update Masterpiece' : 'Register Masterpiece'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-12 border border-espresso/10 text-espresso/40 py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-ivory hover:text-espresso transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
