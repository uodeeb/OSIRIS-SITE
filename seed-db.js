/**
 * Quick Database Seeding Script
 * Run with: node seed-db.js
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const characterAssets = [
  // Narrator variants
  { key: 'character.narrator', kind: 'character', url: '/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png', mime: 'image/png' },
  
  // Yahya variants  
  { key: 'character.yahya', kind: 'character', url: '/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpg', mime: 'image/jpeg' },
  { key: 'character.yahya_breakdown', kind: 'character', url: '/generated-assets/characters/يحيى الراشد-صورة الانهيار (Breakdown Scene).jpg', mime: 'image/jpeg' },
  { key: 'character.yahya_confront', kind: 'character', url: '/generated-assets/characters/يحيى الراشد-صورة المواجهة (Confrontation Scene).jpg', mime: 'image/jpeg' },
  { key: 'character.yahya_dying', kind: 'character', url: '/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpg', mime: 'image/jpeg' },
  { key: 'character.yahya_main', kind: 'character', url: '/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpg', mime: 'image/jpeg' },
  
  // Laila variants
  { key: 'character.laila', kind: 'character', url: '/generated-assets/characters/ليلى حسنالصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
  { key: 'character.laila_faith', kind: 'character', url: '/generated-assets/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpg', mime: 'image/jpeg' },
  { key: 'character.laila_witness', kind: 'character', url: '/generated-assets/characters/ليلى حسن-صورة الشاهدة (Witness Scene — Final Chapter).jpg', mime: 'image/jpeg' },
  { key: 'character.laila_crying', kind: 'character', url: '/generated-assets/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpg', mime: 'image/jpeg' },
  
  // Tarek variants
  { key: 'character.tarek', kind: 'character', url: '/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpg', mime: 'image/jpeg' },
  { key: 'character.tarek_ghost', kind: 'character', url: '/generated-assets/characters/طارق الراشد-صورة التسجيل (Recording — Ghost Image).jpg', mime: 'image/jpeg' },
  { key: 'character.tarek_dream', kind: 'character', url: '/generated-assets/characters/طارق الراشد-صورة الحلم (Dream Sequence).jpg', mime: 'image/jpeg' },
  
  // First Engineer variants
  { key: 'character.first_engineer', kind: 'character', url: '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
  { key: 'character.first_engineer_2', kind: 'character', url: '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait)02.jpeg', mime: 'image/jpeg' },
  { key: 'character.first_engineer_confront', kind: 'character', url: '/generated-assets/characters/المهندس الأول-صورة المواجهة (Confrontation).jpeg', mime: 'image/jpeg' },
  { key: 'character.first_engineer_exposed', kind: 'character', url: '/generated-assets/characters/المهندس الأول-صورة الانكشاف (Exposed — Final Scene).jpeg', mime: 'image/jpeg' },
  
  // Religious/Historical figures
  { key: 'character.arius', kind: 'character', url: '/generated-assets/characters/آريوس.jpeg', mime: 'image/jpeg' },
  { key: 'character.athanasius', kind: 'character', url: '/generated-assets/characters/أثناسيوس.jpeg', mime: 'image/jpeg' },
  { key: 'character.samiri', kind: 'character', url: '/generated-assets/characters/السامري-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
  { key: 'character.samiri_calf', kind: 'character', url: '/generated-assets/characters/السامري-اصورة صناعة العجل (The Golden Calf Scene).png', mime: 'image/png' },
  { key: 'character.constantine', kind: 'character', url: '/generated-assets/characters/قسطنطين-الصورة الأساسية (Portrait).jpg', mime: 'image/jpeg' },
  { key: 'character.ramses', kind: 'character', url: '/generated-assets/characters/RAMSIS.jpg', mime: 'image/jpeg' },
  
  // Other characters
  { key: 'character.abu_abdullah', kind: 'character', url: '/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpg', mime: 'image/jpeg' },
  { key: 'character.dictator', kind: 'character', url: '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Check if assets table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'assets'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Assets table does not exist. Creating it...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS assets (
          id SERIAL PRIMARY KEY,
          key VARCHAR(128) UNIQUE NOT NULL,
          kind VARCHAR(50) NOT NULL,
          url TEXT NOT NULL,
          mime VARCHAR(128),
          bytes INTEGER,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Assets table created');
    }
    
    // Insert or update each asset
    let inserted = 0;
    let updated = 0;
    
    for (const asset of characterAssets) {
      const result = await pool.query(
        `INSERT INTO assets (key, kind, url, mime, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (key) 
         DO UPDATE SET 
           url = EXCLUDED.url,
           mime = EXCLUDED.mime,
           "updatedAt" = NOW()
         RETURNING (xmax = 0) AS inserted`,
        [asset.key, asset.kind, asset.url, asset.mime]
      );
      
      if (result.rows[0].inserted) {
        inserted++;
      } else {
        updated++;
      }
    }
    
    console.log(`✅ Seeding complete: ${inserted} inserted, ${updated} updated`);
    
    // Verify the count
    const countResult = await pool.query('SELECT COUNT(*) FROM assets');
    console.log(`📊 Total assets in database: ${countResult.rows[0].count}`);
    
    // Show sample assets
    const sampleResult = await pool.query('SELECT key, url FROM assets LIMIT 5');
    console.log('📋 Sample assets:');
    sampleResult.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.key}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
