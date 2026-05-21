'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  // Hide footer on gallery/products page
  const hideFooter = /\/products($|\?)/.test(pathname) || pathname.endsWith('/products');
  if (hideFooter) return null;
  return <Footer />;
}
