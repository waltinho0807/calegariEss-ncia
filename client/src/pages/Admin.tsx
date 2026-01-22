import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProducts } from "@/lib/api";
import { Loader2, Plus, Package, FileText, ShieldAlert, LogIn, Database } from "lucide-react";
import type { Lead } from "@shared/schema";

const ADMIN_PHONE = "123456789";
const ADMIN_NAME = "admin";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<Lead | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const user = localStorage.getItem("user_profile");
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUser(parsed);
      if (parsed.phone === ADMIN_PHONE && parsed.name.toLowerCase() === ADMIN_NAME) {
        setIsAuthorized(true);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone === ADMIN_PHONE && loginName.toLowerCase() === ADMIN_NAME) {
      const adminUser = { id: 0, name: loginName, phone: loginPhone, createdAt: new Date() };
      localStorage.setItem("user_profile", JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsAuthorized(true);
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas. Acesso negado.");
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-20">
        <Navbar />
        <div className="container mx-auto max-w-md px-4">
          <div className="rounded-lg border border-white/10 bg-card p-8">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <ShieldAlert className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="mb-2 text-center font-serif text-2xl font-bold text-foreground">
              Área Restrita
            </h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Acesso exclusivo para administradores.
            </p>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-xs uppercase tracking-widest text-muted-foreground">Nome</Label>
                <Input
                  id="adminName"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Nome do administrador"
                  className="rounded-none border-white/10 bg-background"
                  required
                  data-testid="input-admin-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPhone" className="text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                <Input
                  id="adminPhone"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="Telefone do administrador"
                  className="rounded-none border-white/10 bg-background"
                  required
                  data-testid="input-admin-phone"
                />
              </div>
              
              {loginError && (
                <p className="text-center text-sm text-red-500">{loginError}</p>
              )}

              <Button 
                type="submit" 
                className="w-full rounded-none bg-primary text-black hover:bg-primary/90"
                data-testid="button-admin-login"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Acessar Painel
              </Button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-2 font-serif text-4xl font-bold text-foreground">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">Gerencie produtos e postagens do blog.</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 w-full justify-start rounded-none border-b border-white/10 bg-transparent p-0">
            <TabsTrigger 
              value="products" 
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger 
              value="blog" 
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <FileText className="mr-2 h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger 
              value="schemas" 
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Database className="mr-2 h-4 w-4" />
              Schemas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductForm />
          </TabsContent>

          <TabsContent value="blog">
            <BlogPostForm />
          </TabsContent>

          <TabsContent value="schemas">
            <SchemasInfo />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function ProductForm() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [stock, setStock] = useState("10");
  const [isPromotion, setIsPromotion] = useState(false);
  const [promoPrice, setPromoPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          brand, 
          price, 
          image, 
          category, 
          notes,
          stock: parseInt(stock) || 0,
          isPromotion,
          promoPrice: isPromotion && promoPrice ? promoPrice : null,
        }),
      });

      if (!res.ok) throw new Error("Falha ao criar produto");

      setMessage({ type: 'success', text: 'Produto cadastrado com sucesso!' });
      setName("");
      setBrand("");
      setPrice("");
      setImage("");
      setCategory("");
      setNotes("");
      setStock("10");
      setIsPromotion(false);
      setPromoPrice("");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao cadastrar produto. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Cadastrar Novo Produto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nome do Perfume</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rosa Noturna"
              className="rounded-none border-white/10 bg-background"
              required
              data-testid="input-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Marca</Label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Essência Negra"
              className="rounded-none border-white/10 bg-background"
              required
              data-testid="input-product-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Preço (R$)</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 289.90"
              className="rounded-none border-white/10 bg-background"
              required
              data-testid="input-product-price"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="rounded-none border-white/10 bg-background" data-testid="select-product-category">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Unissex">Unissex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">URL da Imagem</Label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Ex: /images/perfume.png"
            className="rounded-none border-white/10 bg-background"
            required
            data-testid="input-product-image"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Notas Olfativas</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Rosa, Baunilha, Âmbar"
            className="rounded-none border-white/10 bg-background"
            required
            data-testid="input-product-notes"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Estoque</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Ex: 10"
              className="rounded-none border-white/10 bg-background"
              min="0"
              data-testid="input-product-stock"
            />
          </div>
          <div className="flex items-end space-x-3 pb-2">
            <input
              type="checkbox"
              id="isPromotion"
              checked={isPromotion}
              onChange={(e) => setIsPromotion(e.target.checked)}
              className="h-5 w-5 rounded border-white/10 bg-background"
              data-testid="checkbox-product-promotion"
            />
            <Label htmlFor="isPromotion" className="text-sm text-muted-foreground cursor-pointer">
              Produto em Promoção
            </Label>
          </div>
        </div>

        {isPromotion && (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Preço Promocional (R$)</Label>
            <Input
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              placeholder="Ex: 199.90"
              className="rounded-none border-white/10 bg-background"
              data-testid="input-product-promo-price"
            />
          </div>
        )}

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="rounded-none bg-primary text-black hover:bg-primary/90"
          data-testid="button-submit-product"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Cadastrar Produto
        </Button>
      </form>
    </div>
  );
}

function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          excerpt, 
          content, 
          image, 
          productId: productId ? parseInt(productId) : null 
        }),
      });

      if (!res.ok) throw new Error("Falha ao criar postagem");

      setMessage({ type: 'success', text: 'Postagem criada com sucesso!' });
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      setProductId("");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar postagem. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Criar Nova Postagem</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Título</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da postagem"
            className="rounded-none border-white/10 bg-background"
            required
            data-testid="input-blog-title"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Resumo</Label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Breve descrição da postagem..."
            className="min-h-[80px] rounded-none border-white/10 bg-background"
            required
            data-testid="input-blog-excerpt"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Conteúdo</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Conteúdo completo da postagem... Use linhas em branco para separar parágrafos."
            className="min-h-[200px] rounded-none border-white/10 bg-background"
            required
            data-testid="input-blog-content"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">URL da Imagem</Label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Ex: /images/perfume.png"
              className="rounded-none border-white/10 bg-background"
              required
              data-testid="input-blog-image"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Produto Relacionado</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="rounded-none border-white/10 bg-background" data-testid="select-blog-product">
                <SelectValue placeholder="Selecione (opcional)..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="rounded-none bg-primary text-black hover:bg-primary/90"
          data-testid="button-submit-blog"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Criar Postagem
        </Button>
      </form>

    </div>
  );
}

function SchemasInfo() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Schemas das Tabelas</h2>
        <p className="mb-8 text-muted-foreground">Estrutura das tabelas do banco de dados para referência.</p>
      </div>

      {/* Products Table */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Tabela: products</h3>
        <div className="overflow-x-auto rounded border border-white/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 font-medium text-primary">Campo</th>
                <th className="px-4 py-3 font-medium text-primary">Tipo</th>
                <th className="px-4 py-3 font-medium text-primary">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">Auto-gerado</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">name</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Nome do perfume</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">brand</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Marca</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">price</td><td className="px-4 py-2">DECIMAL(10,2)</td><td className="px-4 py-2">Preço (ex: 289.90)</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">image</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Caminho da imagem</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">category</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Masculino/Feminino/Unissex</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">notes</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Notas olfativas</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">stock</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">Quantidade em estoque (default: 0)</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">is_promotion</td><td className="px-4 py-2">BOOLEAN</td><td className="px-4 py-2">Produto em promoção (default: false)</td></tr>
              <tr><td className="px-4 py-2 font-mono text-xs">promo_price</td><td className="px-4 py-2">DECIMAL(10,2)</td><td className="px-4 py-2">Preço promocional (opcional)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Tabela: blog_posts</h3>
        <div className="overflow-x-auto rounded border border-white/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 font-medium text-primary">Campo</th>
                <th className="px-4 py-3 font-medium text-primary">Tipo</th>
                <th className="px-4 py-3 font-medium text-primary">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">Auto-gerado</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">title</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Título da postagem</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">excerpt</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Resumo curto</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">content</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Conteúdo completo</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">image</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Caminho da imagem</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">product_id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">ID do produto (opcional)</td></tr>
              <tr><td className="px-4 py-2 font-mono text-xs">created_at</td><td className="px-4 py-2">TIMESTAMP</td><td className="px-4 py-2">Data de criação</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads Table */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Tabela: leads (Usuários)</h3>
        <div className="overflow-x-auto rounded border border-white/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 font-medium text-primary">Campo</th>
                <th className="px-4 py-3 font-medium text-primary">Tipo</th>
                <th className="px-4 py-3 font-medium text-primary">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">Auto-gerado</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">name</td><td className="px-4 py-2">TEXT</td><td className="px-4 py-2">Nome do usuário</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">phone</td><td className="px-4 py-2">TEXT (UNIQUE)</td><td className="px-4 py-2">Telefone/WhatsApp</td></tr>
              <tr><td className="px-4 py-2 font-mono text-xs">created_at</td><td className="px-4 py-2">TIMESTAMP</td><td className="px-4 py-2">Data de cadastro</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Viewed Products Table */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Tabela: viewed_products</h3>
        <div className="overflow-x-auto rounded border border-white/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 font-medium text-primary">Campo</th>
                <th className="px-4 py-3 font-medium text-primary">Tipo</th>
                <th className="px-4 py-3 font-medium text-primary">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">Auto-gerado</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">lead_id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">ID do usuário</td></tr>
              <tr className="border-b border-white/5"><td className="px-4 py-2 font-mono text-xs">product_id</td><td className="px-4 py-2">INTEGER</td><td className="px-4 py-2">ID do produto</td></tr>
              <tr><td className="px-4 py-2 font-mono text-xs">viewed_at</td><td className="px-4 py-2">TIMESTAMP</td><td className="px-4 py-2">Data da visualização</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
