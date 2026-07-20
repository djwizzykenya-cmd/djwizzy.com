'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type MarketplaceItem = {
  name: string;
  price: string;
  type: string;
  rent: boolean;
  description?: string;
};

type MarketplaceContent = {
  title?: string;
  description?: string;
  saleTitle?: string;
  rentTitle?: string;
  noRentText?: string;
  items?: MarketplaceItem[];
};

export default function Marketplace() {
  const [content, setContent] = useState<MarketplaceContent | null>(null);

  useEffect(() => {
    fetch('/api/admin/page?slug=marketplace')
      .then((r) => (r.ok ? r.json().then((j) => setContent(j)) : null))
      .catch(() => {});
  }, []);

  const items: MarketplaceItem[] =
    content?.items || [
      { name: 'CDJ-3000', price: '$3,500', type: 'Equipment', rent: true, description: 'Professional performance media player.' },
      { name: 'Pioneer DDJ-1000', price: '$899', type: 'Controller', rent: false, description: 'Club-standard DJ controller with jog wheels.' },
      { name: 'Technics 1200', price: '$1,200', type: 'Turntable', rent: true, description: 'Iconic analog turntable for vinyl performances.' },
      { name: 'Audio Interface', price: '$199', type: 'Hardware', rent: false, description: 'Studio-grade recording interface for DJs and producers.' },
      { name: 'Headphones Pro', price: '$299', type: 'Accessories', rent: false, description: 'Noise-isolating headphones built for monitoring and mixing.' },
      { name: 'Mixer SVM-7000', price: '$2,500', type: 'Equipment', rent: true, description: 'Advanced DJ mixer with effects and performance pads.' },
      { name: 'Speaker System', price: '$5,000', type: 'Equipment', rent: true, description: 'Full-range speaker package for event sound.' },
      { name: 'Microphone Bundle', price: '$149', type: 'Accessories', rent: false, description: 'Wireless microphone package for emcees and performers.' },
    ];

  const forRent = items.filter((item) => item.rent);
  const forSale = items.filter((item) => !item.rent);
  const saleTitle = content?.saleTitle || 'For Sale';
  const rentTitle = content?.rentTitle || 'For Rent';
  const noRentText = content?.noRentText || 'No items available for rent right now.';
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 sm:mb-20 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {content?.title || 'Marketplace'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
          {content?.description || 'Buy and sell DJ accessories. Explore premium content and accessories.'}
        </p>
      </motion.section>

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{saleTitle}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {forSale.map((item, i) => (
            <motion.div
              key={`sale-${i}`}
              whileHover={{ y: -10 }}
              className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition"
            >
              <div className="h-32 sm:h-40 bg-black/50 rounded-lg mb-3 flex items-center justify-center">
                <p className="text-xs sm:text-sm text-gray-400 text-center px-2">📦 {item.type}</p>
              </div>
              <h3 className="font-bold mb-2 text-sm sm:text-base">{item.name}</h3>
              <p className="text-purple-400 font-bold mb-3 text-sm">{item.price}</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-xs sm:text-sm transition">Buy</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{rentTitle}</h2>
        {forRent.length === 0 ? (
          <p className="text-sm sm:text-base text-gray-400">{noRentText}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {forRent.map((item, i) => (
              <motion.div
                key={`rent-${i}`}
                whileHover={{ y: -10 }}
                className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30 hover:border-purple-500 transition"
              >
                <div className="h-32 sm:h-40 bg-black/50 rounded-lg mb-3 flex items-center justify-center">
                  <p className="text-xs sm:text-sm text-gray-400 text-center px-2">📦 {item.type}</p>
                </div>
                <h3 className="font-bold mb-2 text-sm sm:text-base">{item.name}</h3>
                <p className="text-purple-400 font-bold mb-3 text-sm">{item.price}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-purple-600 hover:bg-purple-600/20 rounded text-xs sm:text-sm transition">Rent</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}