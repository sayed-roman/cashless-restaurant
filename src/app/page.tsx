import { Reservation } from "@/components/forms/reservation";
import { OrderSection } from "@/components/home/order-section";
import { About } from "@/components/home/about";
import { MenuShowcase } from "@/components/home/menu-showcase";
import { Hero } from "@/components/home/hero";
import { PopularDishes } from "@/components/home/popular-dishes";
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <PopularDishes />
      <About />
      <MenuShowcase />
      <OrderSection />
      <Reservation />
    </main>
  );
}
