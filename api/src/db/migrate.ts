import { readFileSync } from 'fs';
import { join } from 'path';
import pool from './connection';

async function migrate() {
  try {
    console.log('ðŸš€ Running migrations...');
    
    const schemaPath = join(__dirname, 'schema.sql');
    let schema = readFileSync(schemaPath, 'utf-8');
    
    // Remove BOM if present
    if (schema.charCodeAt(0) === 0xFEFF) {
      schema = schema.slice(1);
    }
    
    await pool.query(schema);
    
    console.log('âœ… Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('âŒ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
