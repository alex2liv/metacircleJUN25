import { createClient } from '@supabase/supabase-js';
import type { Company } from '@shared/schema';

export interface DatabaseConnection {
  type: 'postgresql' | 'supabase';
  connection: any;
}

export class DatabaseManager {
  private connections: Map<number, DatabaseConnection> = new Map();

  async getCompanyDatabase(company: Company): Promise<DatabaseConnection> {
    // Verifica se já existe uma conexão ativa
    if (this.connections.has(company.id)) {
      return this.connections.get(company.id)!;
    }

    let connection: DatabaseConnection;

    if (company.databaseType === 'supabase' && company.supabaseUrl && company.supabaseServiceKey) {
      // Conecta ao Supabase do cliente
      const supabase = createClient(
        company.supabaseUrl,
        company.supabaseServiceKey
      );
      
      connection = {
        type: 'supabase',
        connection: supabase
      };
    } else {
      // Usa PostgreSQL padrão (pode ser customizado ou o principal)
      const databaseUrl = company.customDatabaseUrl || process.env.DATABASE_URL;
      
      connection = {
        type: 'postgresql',
        connection: databaseUrl // Aqui você pode implementar conexão Drizzle específica
      };
    }

    this.connections.set(company.id, connection);
    return connection;
  }

  async initializeCompanyDatabase(company: Company): Promise<void> {
    const dbConnection = await this.getCompanyDatabase(company);
    
    if (dbConnection.type === 'supabase') {
      // Criar tabelas necessárias no Supabase do cliente
      await this.createSupabaseTables(dbConnection.connection);
    } else {
      // Criar schema específico para a empresa no PostgreSQL principal
      await this.createCompanySchema(company.id);
    }
  }

  private async createSupabaseTables(supabase: any): Promise<void> {
    // Criar as tabelas necessárias no Supabase do cliente
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        avatar TEXT,
        role TEXT NOT NULL DEFAULT 'member',
        is_active BOOLEAN NOT NULL DEFAULT true,
        phone TEXT,
        speciality TEXT,
        bio TEXT,
        company_id INTEGER,
        is_temporary_password BOOLEAN NOT NULL DEFAULT false,
        password_expires_at TIMESTAMP,
        last_password_change TIMESTAMP DEFAULT NOW(),
        reset_token TEXT,
        reset_token_expires_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS communities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        slug TEXT UNIQUE NOT NULL,
        logo TEXT,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        company_id INTEGER NOT NULL,
        domain TEXT,
        theme JSONB,
        owner_id INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS spaces (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        type TEXT NOT NULL,
        community_id INTEGER NOT NULL,
        is_public BOOLEAN NOT NULL DEFAULT true
      )`,
      `CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        space_id INTEGER NOT NULL,
        likes_count INTEGER NOT NULL DEFAULT 0,
        comments_count INTEGER NOT NULL DEFAULT 0,
        is_pinned BOOLEAN NOT NULL DEFAULT false
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        title TEXT NOT NULL,
        space_id INTEGER NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        location TEXT,
        is_online BOOLEAN NOT NULL DEFAULT false,
        max_attendees INTEGER,
        attendees_count INTEGER NOT NULL DEFAULT 0,
        organizer_id INTEGER NOT NULL,
        registration_required BOOLEAN NOT NULL DEFAULT false,
        whatsapp_notifications_sent BOOLEAN NOT NULL DEFAULT false
      )`
    ];

    for (const table of tables) {
      try {
        await supabase.rpc('exec_sql', { sql: table });
      } catch (error) {
        console.error('Erro ao criar tabela no Supabase:', error);
      }
    }
  }

  private async createCompanySchema(companyId: number): Promise<void> {
    // Implementar criação de schema específico no PostgreSQL principal
    // Por exemplo: CREATE SCHEMA company_1;
    console.log(`Creating schema for company ${companyId}`);
  }

  async closeConnection(companyId: number): Promise<void> {
    this.connections.delete(companyId);
  }
}

export const databaseManager = new DatabaseManager();