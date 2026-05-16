'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axios';
import { RootState } from '@/store';
import { 
  Save, Settings, HelpCircle, Image as ImageIcon, X, Loader2, 
  CheckCircle, Upload, Trash2, Home, Info, BookOpen, Phone, 
  Globe, LayoutGrid, Plus, Search 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SettingField {
  id: number;
  key: string;
  label: string;
  value: string;
  type: string;
  section: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

type GroupedSettings = Record<string, SettingField[]>;

const sectionMeta: Record<string, { label: string; icon: any; color: string; desc: string }> = {
  hero:       { label: 'Hero Section',    icon: <Home size={28} />,    color: 'from-gold/20 to-gold/5', desc: 'Manage the main landing page headline, subtitle, and all 4 grid images.' },
  home:       { label: 'Home Page',      icon: <Globe size={28} />,   color: 'from-ivory-dark to-ivory', desc: 'Control the About Us section and the features strip below the hero.' },
  categories: { label: 'Categories',      icon: <LayoutGrid size={28} />, color: 'from-bronze/20 to-bronze/5', desc: 'Add or delete product categories like Buddha, Ganesh, etc.' },
  about:      { label: 'About Us',       icon: <BookOpen size={28} />, color: 'from-ivory-dark to-ivory', desc: 'Edit your brand story, legacy paragraphs, and the story hero image.' },
  contact:    { label: 'Contact',        icon: <Phone size={28} />,    color: 'from-gold/20 to-gold/5', desc: 'Update addresses, phones, emails, and all social media links.' },
  general:    { label: 'General',        icon: <Settings size={28} />, color: 'from-espresso/20 to-espresso/5', desc: 'Global settings like site name, tagline, and meta descriptions.' },
};

export default function AdminSettingsPage() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [grouped, setGrouped] = useState<GroupedSettings>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/admin/login'); return; }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes] = await Promise.all([
        axiosInstance.get('/settings/grouped', { headers: { Authorization: `Bearer ${token}` } }),
        axiosInstance.get('/categories')
      ]);
      setGrouped(settingsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      toast.error('Failed to load sanctuary data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (key: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploadingKey(key);

    try {
      const res = await axiosInstance.post('/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        },
      });
      handleChange(key, res.data.url);
      toast.success('Image processed');
    } catch (err) {
      toast.error('Processing failed');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) return;
    setSaving(true);
    try {
      await axiosInstance.put('/settings', changes, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      setChanges({});
      toast.success('Settings preserved!');
      setTimeout(() => setSaved(false), 3000);
      await fetchData();
    } catch {
      toast.error('Failed to preserve settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await axiosInstance.post('/categories', { name: newCatName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCatName('');
      toast.success('New category established');
      fetchData();
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will be unassigned.')) return;
    try {
      await axiosInstance.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category removed');
      fetchData();
    } catch {
      toast.error('Failed to remove category');
    }
  };

  const getValue = (field: SettingField) => {
    return changes[field.key] !== undefined ? changes[field.key] : field.value;
  };

  const hasChanges = Object.keys(changes).length > 0;
  const currentFields = grouped[activeSection] || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-24 md:pt-32 px-4 md:px-10 pb-40">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 flex-wrap gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-espresso text-gold shadow-xl">
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-espresso uppercase">The Sanctuary <span className="text-gold">CMS</span></h1>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-espresso/40 mt-1">Master Control Panel</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHelp(true)}
            className="p-4 rounded-2xl bg-sacred border border-gold/20 text-gold hover:bg-gold hover:text-espresso transition-all shadow-lg"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0 space-y-4">
          <div className="bg-sacred rounded-[2rem] lg:rounded-[2.5rem] border border-gold/10 shadow-divine p-3 md:p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto no-scrollbar">
            {Object.keys(sectionMeta).map((section) => {
              const meta = sectionMeta[section];
              const active = activeSection === section;
              if (section !== 'categories' && !grouped[section]) return null;
              
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`flex-shrink-0 lg:flex-shrink w-48 lg:w-full flex items-center gap-3 lg:gap-5 p-3 lg:p-5 rounded-[1rem] lg:rounded-[1.5rem] text-left transition-all group ${active ? 'bg-espresso text-sacred shadow-lg lg:shadow-2xl' : 'text-espresso/60 hover:bg-ivory hover:text-espresso'}`}
                >
                  <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl transition-all ${active ? 'bg-gold text-espresso' : 'bg-ivory text-gold group-hover:bg-gold/10'}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest truncate">{meta.label}</p>
                    <p className={`text-[7px] lg:text-[8px] font-bold uppercase tracking-tight mt-0.5 lg:mt-1 ${active ? 'text-gold' : 'opacity-40'}`}>
                      {section === 'categories' ? `${categories.length} Types` : `${grouped[section]?.length || 0} Fields`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          
          <Link href="/admin/dashboard" className="flex items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-sacred border border-gold/10 text-[10px] font-black uppercase tracking-widest text-espresso/40 hover:text-espresso hover:border-gold/30 transition-all">
            Back to Sanctuary
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-sacred rounded-[2rem] lg:rounded-[3rem] border border-gold/10 shadow-divine overflow-hidden relative">
            <div className={`p-6 md:p-10 border-b border-gold/10 bg-gradient-to-br ${sectionMeta[activeSection]?.color || 'from-ivory to-white'}`}>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-espresso flex items-center justify-center text-gold shadow-lg shrink-0">
                  {sectionMeta[activeSection]?.icon}
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black tracking-tighter text-espresso uppercase">{sectionMeta[activeSection]?.label}</h2>
                  <p className="text-espresso/50 text-xs md:text-sm font-medium mt-1">{sectionMeta[activeSection]?.desc}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 md:space-y-12">
              {activeSection === 'categories' ? (
                <div className="space-y-10">
                  {/* Add New Category */}
                  <div className="bg-ivory/30 p-8 rounded-[2rem] border border-gold/10 flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-3 w-full">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/60">New Category Name</label>
                      <input 
                        type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)}
                        placeholder="e.g. Mahakala"
                        className="w-full bg-sacred border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso text-base font-medium focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                    <button 
                      onClick={handleAddCategory}
                      className="bg-espresso text-sacred px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-espresso transition-all flex items-center gap-3 whitespace-nowrap"
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>

                  {/* Categories List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-sacred p-8 rounded-[2rem] border border-gold/10 shadow-sm flex items-center justify-between group hover:border-gold/30 transition-all">
                        <div>
                          <p className="text-lg font-black text-espresso uppercase tracking-tighter">{cat.name}</p>
                          <p className="text-[9px] text-espresso/40 font-bold uppercase tracking-widest mt-1">slug: {cat.slug}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-4 rounded-xl text-espresso/20 hover:text-bronze hover:bg-bronze/5 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                currentFields.map((field) => {
                  const isDirty = changes[field.key] !== undefined;
                  const value = getValue(field);
                  return (
                    <div key={field.key} className={`group space-y-4 p-8 rounded-[2rem] transition-all border ${isDirty ? 'bg-gold/5 border-gold/30' : 'bg-ivory/30 border-transparent hover:border-gold/10'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {field.type === 'image' && <ImageIcon size={14} className="text-gold" />}
                          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/60">{field.label}</label>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-espresso/20 bg-espresso/5 px-3 py-1 rounded-full">{field.key}</span>
                      </div>

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={5} value={value} onChange={e => handleChange(field.key, e.target.value)}
                          className="w-full bg-sacred border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso text-base font-medium focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all resize-none shadow-inner"
                        />
                      ) : field.type === 'image' ? (
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden border border-gold/20 shadow-lg bg-ivory relative group/img">
                              <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                              {uploadingKey === field.key && (
                                <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm flex items-center justify-center">
                                  <Loader2 className="animate-spin text-gold" size={32} />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 w-full space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gold/20 rounded-2xl hover:border-gold hover:bg-gold/5 transition-all cursor-pointer group/upload">
                                  <input 
                                    type="file" accept="image/*" className="hidden" 
                                    onChange={e => e.target.files?.[0] && handleFileUpload(field.key, e.target.files[0])}
                                  />
                                  <Upload size={24} className="text-gold mb-2 group-hover/upload:scale-110 transition-transform" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-espresso/60">Upload Image</span>
                                </label>
                                
                                <div className="space-y-2">
                                  <p className="text-[9px] font-bold text-espresso/40 uppercase tracking-widest">Or Paste URL</p>
                                  <input
                                    type="text" value={value} onChange={e => handleChange(field.key, e.target.value)}
                                    className="w-full bg-sacred border border-gold/15 focus:border-gold rounded-xl px-5 py-4 text-espresso text-xs font-medium focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all shadow-inner"
                                    placeholder="https://..."
                                  />
                                  {isDirty && (
                                    <button onClick={() => handleChange(field.key, field.value)} className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-bronze hover:text-gold transition-colors">
                                      <Trash2 size={10} /> Reset to Original
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text" value={value} onChange={e => handleChange(field.key, e.target.value)}
                          className="w-full bg-sacred border border-gold/15 focus:border-gold rounded-2xl px-6 py-5 text-espresso text-base font-medium focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all shadow-inner"
                        />
                      )}
                    </div>
                  )
                })
              )}
              
              {/* Static Save Button */}
              {activeSection !== 'categories' && (
                <div className="pt-12 border-t border-gold/10 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all ${
                      saved ? 'bg-green-600 text-white shadow-xl' : hasChanges ? 'bg-espresso text-sacred hover:scale-105 shadow-2xl hover:bg-gold hover:text-espresso' : 'bg-espresso/5 text-espresso/20 cursor-not-allowed'
                    }`}
                  >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : saved ? <CheckCircle size={20} /> : <Save size={20} />}
                    {saving ? 'Preserving Changes...' : saved ? 'Successfully Saved' : 'Preserve All Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 md:px-6"
          >
            <div className="bg-espresso shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[1.5rem] md:rounded-[2rem] p-4 flex flex-col sm:flex-row items-center justify-between border border-gold/20 gap-4">
              <div className="px-2 md:px-6 text-center sm:text-left">
                <p className="text-sacred font-black text-xs uppercase tracking-widest">Unsaved Changes</p>
                <p className="text-gold text-[9px] font-bold uppercase tracking-[0.2em]">{Object.keys(changes).length} Fields Modified</p>
              </div>
              <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
                <button
                  onClick={() => setChanges({})}
                  className="flex-1 sm:flex-none px-4 md:px-8 py-3 md:py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-sacred/40 hover:text-sacred bg-sacred/5 hover:bg-sacred/10 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 sm:flex-none flex justify-center items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 rounded-xl bg-gold text-espresso text-[10px] font-black uppercase tracking-widest hover:bg-gold-light hover:scale-105 active:scale-95 transition-all"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save All'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-espresso/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-ivory w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden relative"
            >
              <button onClick={() => setShowHelp(false)} className="absolute top-8 right-8 p-3 rounded-full bg-espresso text-sacred hover:bg-gold hover:text-espresso transition-all z-10">
                <X size={24} />
              </button>

              <div className="p-12 overflow-y-auto max-h-[85vh] space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-5xl font-black tracking-tighter text-espresso uppercase">Sanctuary <span className="text-gold">Guide</span></h2>
                  <p className="text-espresso/50 font-medium text-lg">Visual reference for site management.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-sacred p-8 rounded-[2.5rem] border border-gold/10 space-y-4">
                    <div className="flex items-center gap-3 text-gold">
                       <LayoutGrid size={18} />
                       <h3 className="text-sm font-black uppercase tracking-widest">Categories</h3>
                    </div>
                    <p className="text-[10px] text-espresso/60 leading-relaxed font-medium">Add or remove categories like Tara, Buddha, or Shiva. Once added, they will appear in the gallery filters and when adding new products.</p>
                  </div>
                  <div className="bg-sacred p-8 rounded-[2.5rem] border border-gold/10 space-y-4">
                    <div className="flex items-center gap-3 text-gold">
                       <ImageIcon size={18} />
                       <h3 className="text-sm font-black uppercase tracking-widest">Media Management</h3>
                    </div>
                    <p className="text-[10px] text-espresso/60 leading-relaxed font-medium">Use the "Upload Image" button to securely host your high-resolution ritual art images on Cloudinary.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
