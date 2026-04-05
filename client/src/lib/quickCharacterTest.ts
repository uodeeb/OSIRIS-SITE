/**
 * Quick Character Asset Test
 * 
 * Run this to verify that character assets are loading correctly
 * after the database fix.
 */

import { getAssetUrl } from '@/lib/assetUrls';
import CharacterAssetVerification from './characterVerification';

// Auto-run quick test if this file is executed directly
if (typeof window === 'undefined') {
  runQuickCharacterTest().catch(console.error);
}

/**
 * Quick test function for critical characters
 */
async function runQuickCharacterTest(): Promise<void> {
  console.log('🚀 Quick Character Asset Test');
  console.log('='.repeat(50));
  
  // Test a few critical characters
  const criticalCharacters = [
    'character.narrator',
    'character.yahya',
    'character.laila',
    'character.first_engineer'
  ];
  
  let successCount = 0;
  let totalCount = criticalCharacters.length;
  
  for (const characterKey of criticalCharacters) {
    try {
      console.log(`\n🔍 Testing ${characterKey}...`);
      
      // Test database loading
      const url = await getAssetUrl(characterKey);
      console.log(`✅ Database: ${url.substring(0, 80)}...`);
      
      // Test file accessibility
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        successCount++;
        console.log(`✅ File: Accessible (${response.status})`);
        console.log(`📏 Size: ${response.headers.get('content-length') || 'Unknown'} bytes`);
        console.log(`📄 Type: ${response.headers.get('content-type') || 'Unknown'}`);
      } else {
        console.log(`❌ File: Not accessible (${response.status})`);
      }
      
    } catch (error) {
      console.log(`❌ ${characterKey}: ${error}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Results: ${successCount}/${totalCount} critical characters working`);
  
  if (successCount === totalCount) {
    console.log('🎉 SUCCESS: All critical character assets are working!');
    console.log('💡 You can now proceed with testing the full character system.');
  } else {
    console.log('⚠️  ISSUES: Some character assets still have problems.');
    console.log('💡 Run CharacterAssetVerification.generateVerificationReport() for detailed analysis.');
  }
  
  console.log('='.repeat(50));
}

/**
 * Test all characters
 */
async function runFullCharacterTest(): Promise<void> {
  console.log('🔬 Full Character Asset Test');
  console.log('='.repeat(50));
  
  await CharacterAssetVerification.generateVerificationReport();
}

// Export for manual usage
export const quickCharacterTest = runQuickCharacterTest;
export const fullCharacterTest = runFullCharacterTest;
