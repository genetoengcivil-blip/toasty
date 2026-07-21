import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSearch from "@/components/MenuSearch";
import MenuSection from "@/components/MenuSection";
import CombosSection from "@/components/CombosSection";
import SidesSection from "@/components/SidesSection";
import DrinksSection from "@/components/DrinksSection";
import Depoimentos from "@/components/Depoimentos";
import Footer from "@/components/Footer";
import ProductDrawer from "@/components/ProductDrawer";
import CartSidebar from "@/components/CartSidebar";
import FloatingCartBar from "@/components/FloatingCartBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MenuSearch />
        <MenuSection
          id="salgados"
          title="Salgados"
          subtitle="Sanduíches redondos tostados com ingredientes selecionados."
          category="salgado"
        />
        <MenuSection
          id="doces"
          title="Doces"
          subtitle="Combinações irresistíveis de doce e salgado."
          category="doce"
        />
        <MenuSection
          id="veggie"
          title="Veggie"
          subtitle="Opções vegetarianas com sabor premium."
          category="veggie"
        />
        <SidesSection />
        <DrinksSection />
        <CombosSection />
        <Depoimentos />
      </main>
      <Footer />
      <ProductDrawer />
      <CartSidebar />
      <FloatingCartBar />
    </>
  );
}
