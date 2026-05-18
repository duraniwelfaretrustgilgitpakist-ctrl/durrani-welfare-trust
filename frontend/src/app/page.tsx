import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import StatsSection from '@/components/sections/StatsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import CampaignsSection from '@/components/sections/CampaignsSection';
import GalleryPreviewSection from '@/components/sections/GalleryPreviewSection';
import AwardsSection from '@/components/sections/AwardsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import LeadershipPreviewSection from '@/components/sections/LeadershipPreviewSection';
import NewsSection from '@/components/sections/NewsSection';
import GetInvolvedSection from '@/components/sections/GetInvolvedSection';
import CTASection from '@/components/sections/CTASection';
import PublicLayout from '@/components/PublicLayout';
import BackendWarmup from '@/components/BackendWarmup';

export default function HomePage() {
  return (
    <PublicLayout>
      <BackendWarmup />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <CampaignsSection />
      <GalleryPreviewSection />
      <AwardsSection />
      <TestimonialsSection />
      <LeadershipPreviewSection />
      <NewsSection />
      <GetInvolvedSection />
      <CTASection />
    </PublicLayout>
  );
}
