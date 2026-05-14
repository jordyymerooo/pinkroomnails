import HeroBanner from '../../components/home/HeroBanner';
import ServicesSection from '../../components/home/ServicesSection';
import GallerySection from '../../components/home/GallerySection';
import BookingCTA from '../../components/home/BookingCTA';

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <ServicesSection />
      <GallerySection />
      <BookingCTA />
    </main>
  );
}
