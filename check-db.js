const { Pool } = require('pg');

async function checkDatabase() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    
    console.log('🔍 Checking database contents...');
    
    // Check total assets
    const totalResult = await client.query('SELECT COUNT(*) FROM assets');
    console.log(`📊 Total assets: ${totalResult.rows[0].count}`);
    
    // Check by kind
    const byKind = await client.query('SELECT kind, COUNT(*) FROM assets GROUP BY kind');
    console.log('📋 Assets by kind:');
    byKind.rows.forEach(row => {
      console.log(`  ${row.kind}: ${row.count}`);
    });
    
    // Check character assets specifically
    const characterResult = await client.query('SELECT key, url FROM assets WHERE kind = \'character\' LIMIT 10');
    console.log('👥 Character assets (first 10):');
    characterResult.rows.forEach(row => {
      console.log(`  ${row.key}: ${row.url.substring(0, 60)}...`);
    });
    
    // Check for any obvious issues
    const issues = await client.query(`
      SELECT key, url FROM assets 
      WHERE url LIKE '%generated-assets%' 
      OR url IS NULL 
      OR url = ''
      LIMIT 5
    `);
    
    if (issues.rows.length > 0) {
      console.log('⚠️  Potential issues found:');
      issues.rows.forEach(row => {
        console.log(`  ${row.key}: ${row.url}`);
      });
    }
    
    await client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.log('💡 Make sure DATABASE_URL is set correctly');
  }
}

checkDatabase();
