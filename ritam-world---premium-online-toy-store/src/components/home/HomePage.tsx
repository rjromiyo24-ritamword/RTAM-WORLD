import React from 'react';
import { HeroSlider } from './HeroSlider';
import { FeaturedCategories } from './FeaturedCategories';
import { FlashSaleSection } from './FlashSaleSection';
import { PopularToysSection } from './PopularToysSection';
import { VideoSection } from './VideoSection';
import { WhyChooseUs } from './WhyChooseUs';
import { CustomerReviewsSection } from './CustomerReviewsSection';
import { DeliveryInfoSection } from './DeliveryInfoSection';
import { NewsletterSection } from './NewsletterSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Slider Banner */}
      <HeroSlider />

      {/* 2. Featured Categories Grid */}
      <FeaturedCategories />

      {/* 3. Flash Sale Timer Section */}
      <FlashSaleSection />

      {/* 4. Popular Toys Tabbed Section */}
      <PopularToysSection />

      {/* 5. Unboxing & Review Video Section */}
      <VideoSection />

      {/* 6. Guarantee & Value Props */}
      <WhyChooseUs />

      {/* 7. Verified Customer Reviews */}
      <CustomerReviewsSection />

      {/* 8. Delivery Charge Highlight Banner */}
      <DeliveryInfoSection />

      {/* 9. VIP Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
