import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Eye } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [, setLocation] = useLocation();

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Olá! Gostaria de saber mais sobre o perfume ${product.name} (${product.category}).`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const promoPrice = product.promoPrice ? (typeof product.promoPrice === 'string' ? parseFloat(product.promoPrice) : product.promoPrice) : null;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={() => setLocation(`/produto/${product.id}`)}
      className="cursor-pointer"
    >
      <Card className="group relative overflow-hidden rounded-none border-none bg-card shadow-lg transition-transform hover:-translate-y-2">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-4">
            <button 
              onClick={handleWhatsApp}
              className="rounded-full bg-[#25D366] p-3 text-white transition-transform hover:scale-110"
              title="Chamar no WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <div className="rounded-full bg-white/10 backdrop-blur-md p-3 text-white transition-transform hover:scale-110">
              <Eye className="h-6 w-6" />
            </div>
          </div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isPromotion && (
              <Badge className="bg-red-600 text-white hover:bg-red-600">
                PROMOÇÃO
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                Esgotado
              </Badge>
            )}
          </div>
          
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/80 text-foreground backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </p>
          <h3 className="mb-2 font-serif text-xl font-medium text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 italic">
            {product.notes}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 pb-6">
          <div className="flex h-12 flex-col items-center justify-center">
            {product.isPromotion && promoPrice ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  R$ {price.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-red-500">
                  R$ {promoPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-primary">
                R$ {price.toFixed(2)}
              </span>
            )}
          </div>
          <button 
            className={`w-full rounded-none border border-primary/20 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${
              isOutOfStock 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-secondary/30 text-foreground hover:bg-primary hover:text-black'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Indisponível' : 'Ver Detalhes'}
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
