import heroImage from '@assets/generated_images/dark_luxury_perfume_bottle_hero_image.png';
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function Hero() {
  const handleSupport = () => {
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Tenho uma dúvida sobre os perfumes.')}`, '_blank');
  };

  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-background">
      {/* Background Image with Overlay - Improved Contrast */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary drop-shadow-md"
        >
          Calegari Essência
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 max-w-3xl font-serif text-5xl font-bold leading-tight text-white md:text-7xl drop-shadow-lg"
        >
          Descubra a arte da <span className="text-primary italic">fragrância</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-10 max-w-lg text-lg text-gray-100 drop-shadow-md"
        >
          Uma coleção exclusiva de aromas selecionados para quem busca sofisticação e mistério.
        </motion.p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <motion.button 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-none border border-primary bg-primary px-8 py-3 text-sm font-medium uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-primary"
          >
            Ver Coleção
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            onClick={handleSupport}
            className="flex items-center justify-center gap-2 rounded-none border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Dúvidas? WhatsApp
          </motion.button>
        </div>
      </div>
    </div>
  );
}
