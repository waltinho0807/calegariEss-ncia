import { db } from "../server/db";
import { products } from "../shared/schema";

const initialProducts = [
  {
    name: "Rosa Noturna",
    brand: "Essência Negra",
    price: "289.90",
    image: "/images/perfume-fem-1.png",
    category: "Feminino",
    notes: "Rosa, Baunilha, Âmbar"
  },
  {
    name: "Obsidiana Wood",
    brand: "Essência Negra",
    price: "349.90",
    image: "/images/perfume-masc-1.png",
    category: "Masculino",
    notes: "Cedro, Pimenta Preta, Couro"
  },
  {
    name: "Aurum Citrus",
    brand: "Luxe Edition",
    price: "219.90",
    image: "/images/perfume-uni-1.png",
    category: "Unissex",
    notes: "Bergamota, Limão Siciliano, Almíscar"
  },
  {
    name: "Velvet Orchid",
    brand: "Essência Negra",
    price: "410.00",
    image: "/images/perfume-fem-1.png",
    category: "Feminino",
    notes: "Orquídea, Mel, Rum"
  },
  {
    name: "Midnight Smoke",
    brand: "Luxe Edition",
    price: "389.00",
    image: "/images/perfume-masc-1.png",
    category: "Masculino",
    notes: "Tabaco, Madeira Guaiac, Incenso"
  },
  {
    name: "Pure Gold",
    brand: "Essência Negra",
    price: "299.90",
    image: "/images/perfume-uni-1.png",
    category: "Unissex",
    notes: "Açafrão, Sândalo, Patchouli"
  }
];

async function seed() {
  console.log("Seeding database...");
  
  // Check if products already exist
  const existing = await db.select().from(products);
  if (existing.length > 0) {
    console.log("Products already exist, skipping seed.");
    process.exit(0);
  }

  // Insert products
  for (const product of initialProducts) {
    await db.insert(products).values(product);
    console.log(`Added: ${product.name}`);
  }

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
