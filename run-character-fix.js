const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFile = path.join(__dirname, 'fix-character-assets.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('🔧 Running character asset fix...');
console.log('📄 SQL file:', sqlFile);

// Try to run via different methods
async function runFix() {
  try {
    // Method 1: Check if we can use the database directly
    if (process.env.DATABASE_URL) {
      console.log('🔗 DATABASE_URL found, attempting direct execution...');
      
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      
      const client = await pool.connect();
      try {
        await client.query(sql);
        console.log('✅ Character asset fix completed successfully!');
        
        // Verify the fix
        const result = await client.query('SELECT COUNT(*) FROM assets WHERE kind = \'character\'');
        console.log(`📊 Character assets in database: ${result.rows[0].count}`);
        
      } finally {
        client.release();
        await pool.end();
      }
    } else {
      console.log('❌ DATABASE_URL not found in environment variables');
      console.log('💡 Please set DATABASE_URL and run this script again');
    }
  } catch (error) {
    console.error('❌ Error running character fix:', error.message);
    
    // Fallback: Show what the user should do manually
    console.log('\n🔧 Manual execution required:');
    console.log('1. Open your database client');
    console.log('2. Run the SQL commands from fix-character-assets.sql');
    console.log('3. Or use: psql "$DATABASE_URL" < fix-character-assets.sql');
  }
}

runFix();
