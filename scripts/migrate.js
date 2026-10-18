const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[trimmed.slice(0, eqIdx).trim()] = val;
    }
  });
} catch (e) {
  console.warn('Could not load .env.local:', e.message);
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Neither DIRECT_URL nor DATABASE_URL found in environment.');
  process.exit(1);
}

async function runMigrations() {
  console.log('================================================================');
  console.log('🚀 Leftover Tile Project Planner — Supabase Migration Runner');
  console.log('================================================================');
  console.log(`Connecting to: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log('✅ Connected to PostgreSQL database.\n');

  try {
    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS public._migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    const { rows: appliedRows } = await client.query('SELECT name FROM public._migrations;');
    const appliedSet = new Set(appliedRows.map(r => r.name));

    // 2. Discover migration files
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Discovered ${files.length} migration file(s):`);
    for (const f of files) {
      console.log(`  - ${f} [${appliedSet.has(f) ? 'ALREADY APPLIED' : 'PENDING'}]`);
    }
    console.log('');

    // 3. Execute pending migrations in sequential transactions
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`⏩ Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`🔄 Applying ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');

      const start = Date.now();
      await client.query('BEGIN;');
      try {
        await client.query(sqlContent);
        await client.query('INSERT INTO public._migrations (name) VALUES ($1);', [file]);
        await client.query('COMMIT;');
        const duration = Date.now() - start;
        console.log(`✅ Successfully applied ${file} in ${duration}ms\n`);
      } catch (migrationErr) {
        await client.query('ROLLBACK;');
        console.error(`❌ Migration failed in ${file}:`, migrationErr.message);
        throw migrationErr;
      }
    }

    // 4. Verification and Summary
    console.log('================================================================');
    console.log('📊 Supabase Database Schema Verification Summary');
    console.log('================================================================');

    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name != '_migrations'
      ORDER BY table_name;
    `);

    console.log(`Total Public Tables: ${tables.length}`);
    for (const t of tables) {
      const { rows: countRows } = await client.query(`SELECT COUNT(*)::int as count FROM public."${t.table_name}";`);
      console.log(`  📁 public.${t.table_name.padEnd(25)} -> ${countRows[0].count} rows`);
    }

    // Check seeded projects
    const { rows: projects } = await client.query(`
      SELECT p.slug, p.difficulty, p.verification_status, pt.title 
      FROM public.projects p
      LEFT JOIN public.project_translations pt ON p.id = pt.project_id AND pt.locale = 'en'
      ORDER BY p.slug;
    `);
    console.log(`\nVerified Seeded Projects (${projects.length}):`);
    projects.forEach((p, i) => {
      console.log(`  ${(i + 1).toString().padStart(2, '0')}. [${p.verification_status.toUpperCase()}] ${p.title} (${p.slug})`);
    });

    console.log('\n🎉 ALL MIGRATIONS AND SEEDS COMPLETED SUCCESSFULLY!\n');
  } finally {
    await client.end();
  }
}

runMigrations().catch(err => {
  console.error('\n💥 FATAL MIGRATION ERROR:', err);
  process.exit(1);
});
