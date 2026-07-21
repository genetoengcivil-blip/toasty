"use client";

import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/Toast";
import type { Product } from "@/data/products";

export default function ProductPageClient({
  product,
}: {
  product: Product & { originalPrice?: number; savings?: number };
}) {
  const { openDrawer } = useCartStore();
  const { showToast } = useToast();

  return (
    <button
      onClick={() => {
        openDrawer({
          id: product.id,
          name: product.name,
          description: product.description,
          ingredients: product.ingredients,
          price: product.price,
          image: product.image,
          emoji: product.emoji,
          badge: product.badge,
          tag: product.tag,
          extras: product.extras,
        });
        showToast(`${product.name} adicionado ao carrinho!`);
      }}
      className="btn-primary"
      style={{ width: "100%", padding: "18px", fontSize: "1rem" }}
    >
      Adicionar ao Carrinho
    </button>
  );
}