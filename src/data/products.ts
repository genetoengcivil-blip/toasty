export interface Extra {
  id: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  category: "salgado" | "doce" | "veggie" | "drink" | "side" | "combo";
  image: string;
  imageAlt?: string;
  badge?: string;
  tag?: string;
  emoji: string;
  extras?: Extra[];
}

const salgadoExtras: Extra[] = [
  { id: "Queijo Extra", price: 4.9 },
  { id: "Carne Extra", price: 7.9 },
  { id: "Molho Clássico", price: 5.9 },
  { id: "Molho BBQ", price: 5.9 },
  { id: "Molho Mustard", price: 5.9 },
];

const veggieExtras: Extra[] = [
  { id: "Queijo Extra", price: 4.9 },
  { id: "Molho Clássico", price: 5.9 },
  { id: "Molho BBQ", price: 5.9 },
  { id: "Molho Mustard", price: 5.9 },
];

export const products: Product[] = [
  {
    id: "toasty-carne",
    name: "Toasty Carne",
    description:
      "Carne moída temperada, queijo derretido, alface, tomate e molho especial da casa.",
    ingredients: [
      "Carne moída",
      "Queijo mussarela",
      "Alface",
      "Tomate",
      "Molho especial",
    ],
    price: 34.9,
    category: "salgado",
    image: "/images/toasty classico 03.png",
    imageAlt: "/images/toasty classico.png",
    emoji: "🥩",
    tag: "O clássico",
    extras: salgadoExtras,
  },
  {
    id: "toasty-chicken",
    name: "Toasty Chicken",
    description:
      "Frango desfiado com temperos, queijo cremoso, rúcula e molho de ervas.",
    ingredients: [
      "Frango desfiado",
      "Queijo mussarela",
      "Rúcula",
      "Molho de ervas",
    ],
    price: 34.9,
    category: "salgado",
    image: "/images/toasty chicken 03.png",
    imageAlt: "/images/toasty chicken.png",
    emoji: "🍗",
    tag: "Leve e saboroso",
    extras: salgadoExtras,
  },
  {
    id: "toasty-calabresa",
    name: "Toasty Calabresa",
    description:
      "Calabresa artesanal fatiada, cebola caramelizada, queijo mussarela e azeite.",
    ingredients: [
      "Calabresa artesanal",
      "Cebola caramelizada",
      "Queijo mussarela",
      "Azeite",
    ],
    price: 34.9,
    category: "salgado",
    image: "/images/toasty calabresa 03.png",
    imageAlt: "/images/toasty calabresa.png",
    emoji: "🌶️",
    tag: "Defumado intenso",
    extras: salgadoExtras,
  },
  {
    id: "toasty-costela",
    name: "Toasty Costela",
    description:
      "Costela desfiada low & slow, queijo derretido, pickles de cebola e molho barbecue.",
    ingredients: [
      "Costela desfiada",
      "Queijo mussarela",
      "Pickles de cebola",
      "Molho BBQ",
    ],
    price: 39.9,
    category: "salgado",
    image: "/images/toasty costela 03.png",
    imageAlt: "/images/toasty costela.png",
    badge: "Mais Vendido",
    emoji: "🍖",
    tag: "12h de cocção",
    extras: salgadoExtras,
  },
  {
    id: "toasty-green",
    name: "Toasty Green",
    description:
      "Abacate, rúcula, tomate seco, queijo de cabra e pesto de manjericão.",
    ingredients: [
      "Abacate",
      "Rúcula",
      "Tomate seco",
      "Queijo de cabra",
      "Pesto",
    ],
    price: 29.9,
    category: "veggie",
    image: "/images/toasty green 03.png",
    imageAlt: "/images/toasty green.png",
    emoji: "🥬",
    tag: "Vegetariano premium",
    extras: veggieExtras,
  },
  {
    id: "toasty-nutella",
    name: "Toasty Nutella",
    description:
      "Nutella generosa, banana caramelizada, açúcar com canela e morangos frescos.",
    ingredients: [
      "Nutella",
      "Banana",
      "Canela",
      "Morangos",
    ],
    price: 34.9,
    category: "doce",
    image: "/images/toasty nutella 03.png",
    imageAlt: "/images/toasty nutella.png",
    badge: "Popular",
    emoji: "🍫",
    tag: "Sobremesa",
  },
  {
    id: "toasty-romeu-julieta",
    name: "Toasty Romeu e Julieta",
    description:
      "Queijo minas derretido com goiabada cascão, combinação perfeita de doce e salgado.",
    ingredients: [
      "Queijo minas",
      "Goiabada cascão",
    ],
    price: 34.9,
    category: "doce",
    image: "/images/toasty romeu e julieta 03.png",
    imageAlt: "/images/toasty romeu e julieta.png",
    emoji: "🧀",
    tag: "Clássico brasileiro",
  },
];

export const drinks = [
  { id: "red-berry", name: "Red Berry Soda", description: "Mix de frutas vermelhas com gas natural. 400ml.", ingredients: ["Frutas vermelhas", "Gás natural"], price: 18.9, image: "/images/toasty berry soda 03.png", emoji: "🥓", category: "drink" as const },
  { id: "tropical-passion", name: "Tropical Passion", description: "Maracujá fresco com toque de laranja. 400ml.", ingredients: ["Maracujá", "Laranja"], price: 18.9, image: "/images/toasty tropical soda 03.png", emoji: "🥭", category: "drink" as const },
  { id: "citrus-fresh", name: "Citrus Fresh", description: "Limão siciliano com hortelã e gelo. 400ml.", ingredients: ["Limão siciliano", "Hortelã", "Gelo"], price: 18.9, image: "/images/toasty citrus fresh 03.png", emoji: "🍋", category: "drink" as const },
  { id: "kiwi-breeze", name: "Kiwi Breeze", description: "Kiwi natural com sprite e hortelã. 400ml.", ingredients: ["Kiwi", "Sprite", "Hortelã"], price: 18.9, image: "/images/toasty kiwi breeze 03.png", emoji: "🥝", category: "drink" as const },
  { id: "coca-cola", name: "Coca-Cola", description: "Coca-Cola gelada lata 350ml.", ingredients: ["Coca-Cola 350ml"], price: 8.9, image: "/images/coca cola.png", emoji: "🥤", category: "drink" as const },
  { id: "coca-cola-1l", name: "Coca-Cola 1L", description: "Coca-Cola gelada garrafa 1 litro.", ingredients: ["Coca-Cola 1L"], price: 18.9, image: "/images/coca cola 1 litro.png", emoji: "🥤", category: "drink" as const },
  { id: "guarana", name: "Guaraná", description: "Guaraná Antarctica gelado lata 350ml.", ingredients: ["Guaraná Antarctica 350ml"], price: 8.9, image: "/images/guarana antartica.png", emoji: "🥤", category: "drink" as const },
  { id: "guarana-1l", name: "Guaraná 1L", description: "Guaraná Antarctica gelado garrafa 1 litro.", ingredients: ["Guaraná Antarctica 1L"], price: 18.9, image: "/images/guarana 1 litro.png", emoji: "🥤", category: "drink" as const },
  { id: "fanta-laranja", name: "Fanta Laranja", description: "Fanta Laranja gelada lata 350ml.", ingredients: ["Fanta Laranja 350ml"], price: 8.9, image: "/images/fanta laranja.png", emoji: "🥤", category: "drink" as const },
  { id: "pepsi", name: "Pepsi", description: "Pepsi gelada lata 350ml.", ingredients: ["Pepsi 350ml"], price: 8.9, image: "/images/pepsi.png", emoji: "🥤", category: "drink" as const },
];

export const sides = [
  { id: "batata-rustica", name: "Batata Rústica", description: "Batatas cortadas grossas, temperadas com ervas e alecrim.", ingredients: ["Batata", "Ervas", "Alecrim", "Sal"], price: 15.9, image: "/images/toasty batata rustica 03.png", emoji: "🥔", category: "side" as const },
  { id: "onion-rings", name: "Onion Rings", description: "Anéis de cebola empanados crocantes.", ingredients: ["Cebola", "Farinha empanada", "Temperos"], price: 15.9, image: "/images/toasty onion ring 03.png", emoji: "🧅", category: "side" as const },
  { id: "chips-rustico", name: "Chips Rústico", description: "Chips de batata artesanal com sal rosa.", ingredients: ["Batata artesanal", "Sal rosa", "Temperos"], price: 15.9, image: "/images/toasty chips rustica 03.png", emoji: "🥨", category: "side" as const },
  { id: "salada-green", name: "Salada Green", description: "Mix de folhas, tomate cereja e vinagrete balsâmico.", ingredients: ["Mix de folhas", "Tomate cereja", "Vinagrete balsâmico"], price: 15.9, image: "/images/toasty salada green 03.png", emoji: "🥗", category: "side" as const },
];

export const combos: (Omit<Product, "extras"> & { originalPrice: number; savings: number })[] = [
  {
    id: "combo-classico",
    name: "Combo Clássico",
    description: "Toasty Clássico + Batata Rústica ou Chips + Refrigerante",
    ingredients: ["Toasty à escolha", "Batata Rústica ou Chips", "Refrigerante"],
    originalPrice: 56.7,
    price: 49.9,
    savings: 6.8,
    image: "/images/combo classico.png",
    category: "combo",
    emoji: "✨",
    badge: "Mais Vendido",
  },
  {
    id: "combo-duplo",
    name: "Combo Duplo",
    description: "2 Toastys + 2 Batatas Rústicas + 2 Refrigerantes",
    ingredients: ["2 Toastys à escolha", "2 Batatas Rústicas", "2 Refrigerantes"],
    originalPrice: 116.4,
    price: 89.9,
    savings: 26.5,
    image: "/images/combo duplo.png",
    category: "combo",
    emoji: "🔥",
  },
  {
    id: "combo-familia",
    name: "Combo Família",
    description: "4 Toastys + 2 Batatas + Refrigerante de 1 Litro",
    ingredients: ["4 Toastys à escolha", "2 Batatas", "Refrigerante 1L"],
    originalPrice: 181.4,
    price: 139.9,
    savings: 41.5,
    image: "/images/combo familia.png",
    category: "combo",
    emoji: "👑",
    badge: "Economize R$41",
  },
];

export const instagramPosts = [
  { id: 1, image: "/images/instagram01.png" },
  { id: 2, image: "/images/instagram02.png" },
  { id: 3, image: "/images/instagram03.png" },
  { id: 4, image: "/images/instagram04.png" },
  { id: 5, image: "/images/instagram05.png" },
  { id: 6, image: "/images/instagram06.png" },
  { id: 7, image: "/images/instagram07.png" },
  { id: 8, image: "/images/instagram08.png" },
  { id: 9, image: "/images/instagram09.png" },
  { id: 10, image: "/images/instagram10.png" },
  { id: 11, image: "/images/instagram11.png" },
];
