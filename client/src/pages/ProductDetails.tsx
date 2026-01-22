import { useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft, ShieldCheck, Truck, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
      if (!viewed.includes(product.id)) {
        localStorage.setItem('viewed_products', JSON.stringify([...viewed, product.id]));
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const promoPrice = product.promoPrice ? (typeof product.promoPrice === 'string' ? parseFloat(product.promoPrice) : product.promoPrice) : null;
  const isOutOfStock = product.stock === 0;

  const handleWhatsApp = () => {
    const message = `Olá! Vi o perfume ${product.name} no site e gostaria de mais informações sobre como comprar.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <button 
          onClick={() => window.history.back()}
          className="mb-8 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Imagem do Produto */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square overflow-hidden bg-card"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Detalhes do Produto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="bg-primary text-black hover:bg-primary/90">
                {product.category}
              </Badge>
              {product.isPromotion && (
                <Badge className="bg-red-600 text-white hover:bg-red-600">
                  PROMOÇÃO
                </Badge>
              )}
              {isOutOfStock ? (
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  Esgotado
                </Badge>
              ) : (
                <Badge variant="outline" className="border-green-600 text-green-500">
                  {product.stock} em estoque
                </Badge>
              )}
            </div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl">
              {product.name}
            </h1>
            
            {product.isPromotion && promoPrice ? (
              <div className="mb-8">
                <p className="text-xl text-muted-foreground line-through">
                  R$ {price.toFixed(2)}
                </p>
                <p className="text-3xl font-semibold text-red-500">
                  R$ {promoPrice.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="mb-8 text-3xl font-semibold text-primary">
                R$ {price.toFixed(2)}
              </p>
            )}

            <div className="mb-10 space-y-4 border-y border-white/5 py-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Notas Olfativas</h3>
              <p className="text-lg italic text-muted-foreground">{product.notes}</p>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>100% Original</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-primary" />
                <span>Envio Seguro</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span>Garantia</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsApp}
              disabled={isOutOfStock}
              className={`flex w-full items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-widest transition-transform ${
                isOutOfStock 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#25D366] text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              {isOutOfStock ? 'Produto Esgotado' : 'Comprar via WhatsApp'}
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground uppercase tracking-widest">
              {isOutOfStock ? 'Entre em contato para saber quando terá disponível' : 'Finalize seu pedido diretamente com nossos consultores'}
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
