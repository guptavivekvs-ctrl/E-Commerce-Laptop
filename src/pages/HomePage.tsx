import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesBanner } from '../components/home/FeaturesBanner';
import { BrandShowcase } from '../components/home/BrandShowcase';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { OffersSection } from '../components/home/OffersSection';
import { AIChatbotBanner } from '../components/home/AIChatbotBanner';
import { StorageService, subscribeToStoreChanges } from '../services/storageService';
import { Product } from '../types';

interface HomePageProps {
  onOpenChatbot: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenChatbot }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    StorageService.getProducts().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
    const unsubscribe = subscribeToStoreChanges(loadProducts);
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection onOpenChatbot={onOpenChatbot} />
      <FeaturesBanner />
      <BrandShowcase />
      <FeaturedSection products={products} />
      <OffersSection products={products} />
      <AIChatbotBanner onOpenChatbot={onOpenChatbot} />
    </div>
  );
};
