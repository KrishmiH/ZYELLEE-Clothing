import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import BrandStory from "@/components/home/BrandStory";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <NewArrivals />
        <BrandStory />
      </main>

      <Footer />
    </>
  );
}
