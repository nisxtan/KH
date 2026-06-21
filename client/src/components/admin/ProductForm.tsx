'use client';

import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/api/axios';
import { toast } from 'react-hot-toast';
import { X, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
  className?: string;
}

export default function ProductForm({ 
  initialData, 
  onSuccess, 
  onCancel,
  className = "bg-sacred p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-divine border border-gold/10"
}: ProductFormProps) {
  const [formData, setFormData] = useState(() => {
    const base = initialData || {
      name: '',
      description: '',
      price: '',
      size: '',
      material: '',
      images: [],
      featured: false,
      available: true,
      stock: 0,
    };
    return {
      ...base,
      stock: base.stock !== undefined ? base.stock : 0,
    };
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // No category loading needed anymore
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

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 md:space-y-12 ${className}`}>
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

        {/* Stock */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/40">Number of Stock</label>
          <input
            type="number"
            className="w-full bg-ivory/30 border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso font-medium focus:outline-none transition-all shadow-inner"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            required
            min="0"
            placeholder="0"
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
