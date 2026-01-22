import type { Product, Lead } from "@shared/schema";

const API_BASE = "/api";

// Products
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Leads (Authentication)
export async function registerLead(name: string, phone: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to register");
  }
  return res.json();
}

export async function loginLead(phone: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to login");
  }
  return res.json();
}

// Viewed Products
export async function addViewedProduct(leadId: number, productId: number): Promise<void> {
  await fetch(`${API_BASE}/viewed-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId, productId }),
  });
}

export async function getViewedProducts(leadId: number): Promise<number[]> {
  const res = await fetch(`${API_BASE}/viewed-products/${leadId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((v: any) => v.productId);
}

// Blog Posts
import type { BlogPost } from "@shared/schema";

export async function fetchBlogPosts(page: number = 1, limit: number = 6): Promise<{ posts: BlogPost[]; total: number }> {
  const res = await fetch(`${API_BASE}/blog?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function fetchBlogPostById(id: number): Promise<BlogPost> {
  const res = await fetch(`${API_BASE}/blog/${id}`);
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}
