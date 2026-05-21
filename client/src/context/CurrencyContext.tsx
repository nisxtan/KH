'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import axiosInstance from '@/api/axios';

interface CurrencyContextType {
  formatPrice: (priceNpr: number) => string;
  currencySymbol: string;
  currencyCode: string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    axiosInstance.get('/settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  // Determine currency symbol, code, and rate based on active locale
  let currencyCode = 'NPR';
  let currencySymbol = 'Rs. ';
  let exchangeRate = 1;

  if (locale === 'en') {
    currencyCode = 'NPR';
    currencySymbol = 'Rs. ';
    exchangeRate = 1;
  } else if (locale === 'ne') {
    currencyCode = 'NPR';
    currencySymbol = 'रु ';
    exchangeRate = 1;
  } else if (['fr', 'de', 'es'].includes(locale)) {
    currencyCode = 'EUR';
    currencySymbol = '€';
    exchangeRate = parseFloat(settings['currency_eur_rate'] || '144.20');
  } else if (locale === 'zh') {
    // For Chinese buyers, let's use USD as standard for international exports
    currencyCode = 'USD';
    currencySymbol = '$';
    exchangeRate = parseFloat(settings['currency_usd_rate'] || '133.50');
  }

  const formatPrice = (priceNpr: number) => {
    const converted = priceNpr / exchangeRate;
    
    // Format converted value
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: exchangeRate === 1 ? 0 : 2,
      maximumFractionDigits: exchangeRate === 1 ? 0 : 2,
    });

    return `${currencySymbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ formatPrice, currencySymbol, currencyCode, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
