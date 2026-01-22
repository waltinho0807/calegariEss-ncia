import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { fetchBlogPosts } from "@/lib/api";
import { useLocation } from "wouter";
import { Loader2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ["blog", page],
    queryFn: () => fetchBlogPosts(page, POSTS_PER_PAGE),
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold text-foreground md:text-5xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Conheça mais sobre nossas fragrâncias exclusivas e descubra o perfume perfeito para você.
          </p>
          <div className="mx-auto mt-6 h-1 w-24 bg-primary"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer overflow-hidden bg-card"
                  onClick={() => setLocation(`/blog/${post.id}`)}
                  data-testid={`card-blog-${post.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-6">
                    <p className="mb-2 text-xs uppercase tracking-widest text-primary">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <h2 className="mb-3 font-serif text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <button className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary transition-all group-hover:gap-3">
                      Saiba Mais <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 rounded-none border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 rounded-none border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  data-testid="button-next-page"
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">Nenhuma postagem encontrada.</p>
          </div>
        )}
      </div>
    </main>
  );
}
