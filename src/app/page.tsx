import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSearch from "@/components/MenuSearch";
import MenuSection from "@/components/MenuSection";
import CombosSection from "@/components/CombosSection";
import SidesSection from "@/components/SidesSection";
import DrinksSection from "@/components/DrinksSection";
import Footer from "@/components/Footer";

const Depoimentos = dynamic(() => import("@/components/Depoimentos"));
const ProductDrawer = dynamic(() => import("@/components/ProductDrawer"));
const CartSidebar = dynamic(() => import("@/components/CartSidebar"));
const FloatingCartBar = dynamic(() => import("@/components/FloatingCartBar"));

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
