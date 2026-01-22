import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostById, fetchProductById } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Loader2, Calendar } from "lucide-react";

export default function BlogPostPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["blogPost", id],
    queryFn: () => fetchBlogPostById(Number(id)),
    enabled: !!id,
  });

  const { data: product } = useQuery({
    queryKey: ["product", post?.productId],
    queryFn: () => fetchProductById(post!.productId!),
    enabled: !!post?.productId,
  });

  if (postLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>Postagem não encontrada.</p>
      </div>
    );
  }

  const price = product?.price ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price) : 0;

  const handleWhatsApp = () => {
    const message = product 
      ? `Olá! Vi a postagem sobre ${product.name} no blog e gostaria de mais informações.`
      : `Olá! Vi a postagem "${post.title}" no blog e gostaria de mais informações.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      
      <article className="container mx-auto px-4">
        <button 
          onClick={() => setLocation('/blog')}
          className="mb-8 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
        </button>

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>

            <h1 className="mb-8 font-serif text-3xl font-bold text-foreground md:text-5xl leading-tight">
              {post.title}
            </h1>

            <div className="relative mb-12 aspect-video overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="prose prose-invert prose-lg max-w-none mb-12">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {product && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-16 border-t border-white/10 pt-12"
              >
                <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
                  Produto Mencionado
                </h2>
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                  <div 
                    className="aspect-square w-full max-w-[200px] cursor-pointer overflow-hidden bg-card"
                    onClick={() => setLocation(`/produto/${product.id}`)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {product.brand}
                    </p>
                    <h3 
                      className="mb-2 cursor-pointer font-serif text-2xl font-bold text-foreground transition-colors hover:text-primary"
                      onClick={() => setLocation(`/produto/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="mb-1 text-sm italic text-muted-foreground">
                      {product.notes}
                    </p>
                    <p className="mb-6 text-xl font-semibold text-primary">
                      R$ {price.toFixed(2)}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setLocation(`/produto/${product.id}`)}
                        className="rounded-none border border-primary/20 bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-primary hover:text-black"
                        data-testid="button-view-product"
                      >
                        Ver Detalhes
                      </button>
                      <button 
                        onClick={handleWhatsApp}
                        className="flex items-center gap-2 rounded-none bg-[#25D366] px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
                        data-testid="button-whatsapp"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Comprar via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </article>
    </main>
  );
}
