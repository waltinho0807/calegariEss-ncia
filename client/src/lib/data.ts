import imgFem from '@assets/generated_images/floral_feminine_perfume_bottle_pink_liquid.png';
import imgMasc from '@assets/generated_images/masculine_dark_glass_perfume_bottle.png';
import imgUni from '@assets/generated_images/unisex_minimalist_perfume_bottle_gold_cap.png';
import type { Product } from "@/components/ProductCard";

export const products: Product[] = [
  {
    id: 1,
    name: "Rosa Noturna",
    brand: "Essência Negra",
    price: 289.90,
    image: imgFem,
    category: "Feminino",
    notes: "Rosa, Baunilha, Âmbar"
  },
  {
    id: 2,
    name: "Obsidiana Wood",
    brand: "Essência Negra",
    price: 349.90,
    image: imgMasc,
    category: "Masculino",
    notes: "Cedro, Pimenta Preta, Couro"
  },
  {
    id: 3,
    name: "Aurum Citrus",
    brand: "Luxe Edition",
    price: 219.90,
    image: imgUni,
    category: "Unissex",
    notes: "Bergamota, Limão Siciliano, Almíscar"
  },
  {
    id: 4,
    name: "Velvet Orchid",
    brand: "Essência Negra",
    price: 410.00,
    image: imgFem, // Reusing for demo
    category: "Feminino",
    notes: "Orquídea, Mel, Rum"
  },
  {
    id: 5,
    name: "Midnight Smoke",
    brand: "Luxe Edition",
    price: 389.00,
    image: imgMasc, // Reusing for demo
    category: "Masculino",
    notes: "Tabaco, Madeira Guaiac, Incenso"
  },
  {
    id: 6,
    name: "Pure Gold",
    brand: "Essência Negra",
    price: 299.90,
    image: imgUni, // Reusing for demo
    category: "Unissex",
    notes: "Açafrão, Sândalo, Patchouli"
  }
];
