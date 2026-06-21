'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import axiosInstance from '@/api/axios';
import { logout } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, LogOut, Package, Image as ImageIcon, Settings, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data.items);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      dispatch(logout());
      router.push('/admin/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="pt-32 pb-24 bg-ivory min-h-screen px-6">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-sacred p-8 rounded-3xl shadow-divine border border-gold/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-espresso text-gold"><Package size={18} /></div>
              <h1 className="text-2xl font-black tracking-tighter text-espresso uppercase">Admin Dashboard</h1>
            </div>
            <p className="text-espresso/40 text-xs font-black uppercase tracking-widest">Welcome back, <span className="text-gold">{user?.username}</span></p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              className="flex items-center gap-2 bg-espresso text-sacred px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-espresso transition-all shadow-lg"
            >
              <Plus size={16} /> Add Product
            </button>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 bg-gold/10 text-espresso border border-gold/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-espresso transition-all"
            >
              <Settings size={16} /> Site Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-200/50 text-red-400 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-sacred p-8 rounded-3xl border border-gold/10 shadow-divine flex items-center gap-6">
            <div className="p-4 bg-espresso rounded-2xl text-gold"><Package size={24} /></div>
            <div>
              <p className="text-[9px] uppercase font-black tracking-widest text-espresso/40">Total Products</p>
              <p className="text-4xl font-black text-espresso tracking-tighter">{products.length}</p>
            </div>
          </div>
          <Link href="/admin/settings" className="bg-sacred p-8 rounded-3xl border border-gold/10 shadow-divine flex items-center gap-6 hover:border-gold/30 transition-all group">
            <div className="p-4 bg-gold/10 rounded-2xl text-gold group-hover:bg-gold group-hover:text-espresso transition-all"><Settings size={24} /></div>
            <div>
              <p className="text-[9px] uppercase font-black tracking-widest text-espresso/40">Site Settings</p>
              <p className="text-lg font-black text-espresso tracking-tighter">Edit Page Content</p>
            </div>
          </Link>
        </div>

        {/* Form Modal/Overlay */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-sacred rounded-[2rem] md:rounded-[3rem] shadow-divine border border-gold/10"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setShowForm(false)} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 z-10 text-espresso/40 hover:text-red-500 transition-colors p-2 bg-ivory/80 backdrop-blur-md rounded-full shadow-md border border-gold/15"
                >
                  <Plus size={24} className="rotate-45" />
                </button>

                <div className="p-6 md:p-10">
                  <div className="mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-espresso uppercase">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mt-1">
                      {editingProduct ? 'Update current masterpiece details' : 'Register a new masterpiece'}
                    </p>
                  </div>

                  <ProductForm
                    initialData={editingProduct}
                    className="space-y-8 md:space-y-12"
                    onSuccess={() => {
                      setShowForm(false);
                      fetchProducts();
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product List */}
        <div className="bg-sacred rounded-3xl shadow-divine border border-gold/10 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-espresso text-sacred">
                <tr>
                  <th className="p-6 uppercase tracking-widest text-[9px] font-black whitespace-nowrap">Product</th>
                  <th className="p-6 uppercase tracking-widest text-[9px] font-black whitespace-nowrap">Category</th>
                  <th className="p-6 uppercase tracking-widest text-[9px] font-black whitespace-nowrap">Price</th>
                  <th className="p-6 uppercase tracking-widest text-[9px] font-black whitespace-nowrap">Stock</th>
                  <th className="p-6 uppercase tracking-widest text-[9px] font-black whitespace-nowrap">Status</th>
                  <th className="p-6 uppercase tracking-widest text-[9px] font-black text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-ivory transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-ivory border border-gold/10 shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-espresso/20"><ImageIcon size={20} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-espresso text-sm">{product.name}</p>
                          <p className="text-[10px] text-espresso/40 font-bold uppercase tracking-wider">{product.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-xs font-bold text-espresso/50 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</td>
                    <td className="p-6 font-black text-gold text-sm whitespace-nowrap">Rs. {Number(product.price).toLocaleString()}</td>
                    <td className="p-6 text-xs font-bold text-espresso/50 uppercase tracking-wider">{product.stock !== undefined ? product.stock : 0} units</td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                        <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-full inline-block w-fit ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </span>
                        {product.featured && (
                          <span className="text-[9px] uppercase font-black px-3 py-1 rounded-full bg-gold/15 text-bronze inline-block w-fit">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingProduct(product); setShowForm(true); }}
                          className="p-3 rounded-2xl bg-ivory border border-gold/10 text-espresso/50 hover:text-espresso hover:border-gold/30 transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="p-3 rounded-2xl bg-ivory border border-red-100 text-red-300 hover:text-red-500 hover:border-red-200 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gold/10">
            {products.map((product: any) => (
              <div key={product.id} className="p-5 space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-ivory border border-gold/10 shrink-0">
                    {product.images[0] ? (
                      <img src={product.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-espresso/20"><ImageIcon size={20} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-espresso text-base truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] text-espresso/50 font-bold uppercase tracking-widest truncate">{product.category?.name || 'Uncategorized'}</p>
                      <span className="text-gold">•</span>
                      <p className="text-[9px] text-espresso/40 font-bold uppercase tracking-widest truncate">{product.size}</p>
                      <span className="text-gold">•</span>
                      <p className="text-[9px] text-espresso/50 font-bold uppercase tracking-widest truncate">Stock: {product.stock !== undefined ? product.stock : 0}</p>
                    </div>
                    <p className="font-black text-gold text-sm mt-2">Rs. {Number(product.price).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                    {product.featured && (
                      <span className="text-[9px] uppercase font-black px-3 py-1 rounded-full bg-gold/15 text-bronze">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingProduct(product); setShowForm(true); }} className="p-2.5 rounded-xl bg-ivory border border-gold/10 text-espresso hover:bg-gold/20 transition-all">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2.5 rounded-xl bg-ivory border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products.length === 0 && !loading && (
            <div className="p-24 text-center">
              <div className="flex justify-center text-espresso/10 mb-6"><LayoutGrid size={48} /></div>
              <p className="text-espresso/30 font-black uppercase tracking-widest text-xs">No products found. Add your first masterpiece!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
