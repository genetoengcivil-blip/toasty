import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products, combos } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import ProductPageClient from "./ProductPageClient";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const allProducts = [...products, ...combos];
  return allProducts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const allProducts = [...products, ...combos];
  const product = allProducts.find((p) => p.id === slug);

  if (!product) return { title: "Produto não encontrado — TOASTY" };

  return {
    title: `${product.name} — TOASTY®`,
    description: product.description,
    openGraph: {
      title: `${product.name} — TOASTY®`,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const allProducts = [...products, ...combos];
  const product = allProducts.find((p) => p.id === slug);

  if (!product) notFound();

  const isCombo = "originalPrice" in product;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", paddingBottom: "80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Back button */}
      <div
        style={{
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          background: "var(--bg-page)",
          zIndex: 10,
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          ← Voltar ao cardápio
        </Link>
        <Link
          href={`/pedidos`}
          style={{
            color: "#C8943E",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          Meus Pedidos →
        </Link>
      </div>

      {/* Hero image */}
      <div
        style={{
          position: "relative",
          height: "340px",
          background: "var(--bg-card)",
          overflow: "hidden",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, var(--bg-page), transparent)",
          }}
        />
        {product.badge && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "#7B001C",
              color: "white",
              padding: "8px 20px",
              borderRadius: "50px",
              fontSize: "0.8rem",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(123,0,28,0.5)",
            }}
          >
            {product.badge}
          </div>
        )}
        {isCombo && "savings" in product && product.savings && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "linear-gradient(135deg, #C8943E, #E0B860)",
              color: "#060606",
              padding: "8px 20px",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: 800,
              boxShadow: "0 4px 16px rgba(200,148,62,0.5)",
            }}
          >
            💰 ECONOMIZE {formatPrice(product.savings)}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px", maxWidth: "720px", margin: "0 auto" }}>
        {/* Title + price */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h1>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#C8943E" }}>
              {formatPrice(product.price)}
            </div>
            {isCombo && "originalPrice" in product && product.originalPrice && (
              <div
                style={{
                  textDecoration: "line-through",
                  color: "var(--text-faint)",
                  fontSize: "1rem",
                }}
              >
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Tag */}
        {"tag" in product && product.tag && (
          <span
            style={{
              display: "inline-block",
              padding: "4px 14px",
              background: "rgba(123,0,28,0.15)",
              border: "1px solid rgba(123,0,28,0.25)",
              borderRadius: "50px",
              color: "#E0B860",
              fontSize: "0.75rem",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Emoji showcase */}
        <div
          style={{
            fontSize: "4rem",
            textAlign: "center",
            marginBottom: "16px",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
          }}
        >
          {product.emoji}
        </div>

        {/* Description */}
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          {product.description}
        </p>

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              Ingredientes
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "50px",
                    color: "var(--text-secondary)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Delivery info */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>⏱</span>
            <span>Entrega 30–45 min</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>📍</span>
            <span>Delivery em toda cidade</span>
          </div>
        </div>

        {/* CTA */}
        <ProductPageClient product={product} />
      </div>
    </div>
  );
}