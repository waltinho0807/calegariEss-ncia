import { User, ShoppingBag, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import type { Lead } from "@shared/schema";

export function Navbar() {
  const [, setLocation] = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Lead | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user_profile");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, [isAuthOpen]);

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('#')) {
      window.location.href = '/' + path;
    } else {
      setLocation(path);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-foreground/70 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="cursor-pointer" onClick={() => setLocation('/')}>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                Calegari <span className="text-primary">Essência</span>
              </span>
            </div>
          </div>
          
          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => setLocation('/')} className="text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary">Home</button>
            <a href="/#collection" className="text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary">Coleção</a>
            <button onClick={() => setLocation('/blog')} className="text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary">Blog</button>
            <a href="/#about" className="text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary">Sobre</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/carrinho')}
              className="text-foreground/70 hover:text-primary transition-colors"
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
              data-testid="button-auth"
            >
              <User className="h-5 w-5" />
              {!currentUser && (
                <span className="hidden sm:inline text-xs font-medium uppercase tracking-widest">Entrar</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 z-[70] h-full w-72 bg-background border-r border-white/10 transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-serif text-lg font-bold text-foreground">
            Essência <span className="text-primary">Negra</span>
          </span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-foreground/70 hover:text-primary transition-colors"
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-1">
          <button 
            onClick={() => handleNavClick('/')} 
            className="text-left py-3 px-4 text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary hover:bg-white/5 rounded"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick('#collection')} 
            className="text-left py-3 px-4 text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary hover:bg-white/5 rounded"
          >
            Coleção
          </button>
          <button 
            onClick={() => handleNavClick('/blog')} 
            className="text-left py-3 px-4 text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary hover:bg-white/5 rounded"
          >
            Blog
          </button>
          <button 
            onClick={() => handleNavClick('#about')} 
            className="text-left py-3 px-4 text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary hover:bg-white/5 rounded"
          >
            Sobre
          </button>
          <div className="h-px bg-white/10 my-4" />
          <button 
            onClick={() => handleNavClick('/carrinho')} 
            className="flex items-center gap-3 py-3 px-4 text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary hover:bg-white/5 rounded"
          >
            <ShoppingBag className="h-4 w-4" />
            Interesses
          </button>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsAuthOpen(true);
            }} 
            className="flex items-center gap-3 py-3 px-4 text-sm font-medium uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary hover:bg-white/5 rounded"
          >
            <User className="h-4 w-4" />
            {currentUser ? currentUser.name : 'Entrar'}
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
