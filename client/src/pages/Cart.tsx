import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function CartPage() {
  const [viewedProductIds, setViewedProductIds] = useState<number[]>([]);
  const [, setLocation] = useLocation();

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    const stored = localStorage.getItem('viewed_products');
    if (stored) {
      setViewedProductIds(JSON.parse(stored));
    }
  }, []);

  const cartProducts = allProducts.filter(p => viewedProductIds.includes(p.id));

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold text-foreground">Seus Interesses</h1>
          <div className="flex items-center gap-2 text-primary">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-lg font-bold">{cartProducts.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cartProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cartProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 rounded-full bg-card p-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Nenhum Perfume Visualizado</h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              Você ainda não explorou nenhum perfume. Visite nossa coleção para encontrar sua fragrância ideal.
            </p>
            <button 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 rounded-none border border-primary bg-primary px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-primary"
            >
              Explorar Coleção <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
