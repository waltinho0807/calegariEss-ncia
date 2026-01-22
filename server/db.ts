import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// ============================================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ============================================================
// 
// OPÇÃO 1: REPLIT POSTGRESQL (Padrão - usado em desenvolvimento)
// O banco do Replit é gratuito para desenvolvimento.
// Para produção, há custo por uso.
//
// OPÇÃO 2: SUPABASE (Alternativa gratuita para produção)
// 1. Crie uma conta em https://supabase.com
// 2. Crie um novo projeto
// 3. Vá em Settings > Database > Connection string
// 4. Copie a string de conexão (URI)
// 5. Substitua [YOUR-PASSWORD] pela senha do projeto
// 6. Comente a OPÇÃO 1 e descomente a OPÇÃO 2 abaixo
//
// ============================================================

// --- OPÇÃO 1: REPLIT POSTGRESQL (ATIVO) ---
//if (!process.env.DATABASE_URL) {
//  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
//}
//const connectionString = process.env.DATABASE_URL;

// --- OPÇÃO 2: SUPABASE (COMENTADO) ---
// Para usar Supabase, comente a OPÇÃO 1 acima e descomente abaixo:
// 
const connectionString = "postgresql://postgres:waltinho@mor4@db.ciceusyzkhjithkcmkik.supabase.co:5432/postgres";
// 
// Ou use variável de ambiente:
// const connectionString = process.env.SUPABASE_DATABASE_URL;

const pool = new pg.Pool({
  connectionString: connectionString,
});

export const db = drizzle(pool, { schema });
